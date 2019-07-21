import Ledger from "@lunie/cosmos-ledger";
import React, { createContext } from "react";

import { Classes, Dialog, H6 } from "@blueprintjs/core";
import BigNumber from "bignumber.js";
import { Centered, SpaceLoader, View } from "components/Common";
import Toast from "components/Toast";
import { ThemeProps, withTheme } from "containers/ThemeContainer";
import { withAccountsQuery } from "graphql/queries";
import { withContextFactory } from "tools/context-utils";
import {
  COSMOS_MESSAGE_TYPES,
  createCosmosPostTx,
  createCosmosTransactionMessage,
} from "tools/cosmos-utils";
import { createSignMessage } from "tools/ledger-utils";
import { composeWithProps } from "tools/utils";
import { StateContextProps, withState } from "./StateContainer";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface LedgerContext {
  cosmosAddress: string;
  placeBid: (auctionId: string, bid: string) => Promise<void>;
  connectLedgerDevice: () => Promise<void>;
}

export type LedgerContextProps = LedgerContext;

const initialContext: LedgerContext = {
  cosmosAddress: "",
  connectLedgerDevice: async () => {
    return;
  },
  placeBid: async (auctionId: string, bid: string) => {
    return;
  },
};

interface IProps extends ThemeProps, StateContextProps {
  children: JSX.Element;
}

interface IState {
  tx?: any;
  ledger: Ledger | null;
  ledgerDialogOpen: boolean;
  ledgerConnected: boolean;
  cosmosAddress: string;
  confirmTx: boolean;
}

/** ===========================================================================
 * Context & Provider Setup
 * ============================================================================
 */

const ledgerContext = createContext<LedgerContext>(initialContext);

class LedgerProviderClass extends React.Component<IProps, IState> {
  timer: any = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      ledger: null,
      ledgerDialogOpen: false,
      ledgerConnected: false,
      cosmosAddress: "",
      confirmTx: false,
    };
  }

  componentWillUnmount() {
    this.clearLedgerPoll();
  }

  clearLedgerPoll = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  render(): JSX.Element {
    return (
      <ledgerContext.Provider
        value={{
          placeBid: this.placeBid,
          cosmosAddress: this.state.cosmosAddress,
          connectLedgerDevice: this.handleConnectLedgerDevice,
        }}
      >
        <React.Fragment>
          <Dialog
            style={{
              width: 600,
              height: 315,
            }}
            autoFocus
            usePortal
            enforceFocus
            canEscapeKeyClose
            canOutsideClickClose
            icon="control"
            title="Connect Hardware Ledger"
            isOpen={this.state.ledgerDialogOpen}
            onClose={() => this.setLedgerDialogState(false)}
            className={this.props.themeProps.isDarkTheme ? Classes.DARK : ""}
          >
            <View className={Classes.DIALOG_BODY}>
              {this.state.confirmTx ? (
                <View>
                  <H6>
                    Please confirm the transaction details on your ledger device
                  </H6>
                  {JSON.stringify(this.state.tx)}
                </View>
              ) : this.state.ledgerConnected ? (
                <H6>Ledger Connected!</H6>
              ) : (
                <H6>Please connect your Ledger Device...</H6>
              )}
              {!this.state.ledgerConnected && (
                <Centered>
                  <SpaceLoader />
                </Centered>
              )}
            </View>
          </Dialog>
        </React.Fragment>
        ;{this.props.children}
      </ledgerContext.Provider>
    );
  }

  setLedgerDialogState = (ledgerDialogOpen: boolean) => {
    this.setState({ ledgerDialogOpen }, () => {
      if (!ledgerDialogOpen) {
        this.clearLedgerPoll();
      }
    });
  };

  handleConnectLedgerDevice = async () => {
    this.setLedgerDialogState(true);
    await this.connectLedger();
  };

  connectLedger = async () => {
    try {
      console.log("Connecting to Hardware Ledger Device...");

      const LedgerDevice = new Ledger({ testModeAllowed: true });
      const ledger = await LedgerDevice.connect();
      this.setState({ ledger, ledgerConnected: true });
      this.getCosmosAddress();
    } catch (error) {
      this.setState({ ledger: null, ledgerConnected: false });
      console.log(
        "Error connecting to Ledger Device (will retry connection): ",
        error,
      );

      // TODO: Handle other error states?
      const SCREENSAVER_MODE_ERROR = "Ledger's screensaver mode is on";
      const { message } = error;

      let retryDelay = 500;

      if (message === SCREENSAVER_MODE_ERROR) {
        Toast.warn(
          "The screensaver mode is currently active on the Ledger Device",
        );

        /* Extend the retry retryDelay */
        retryDelay = 4000;
      }

      // tslint:disable-next-line
      this.timer = setTimeout(this.connectLedger, retryDelay);
    }
  };

  getCosmosAddress = async () => {
    if (this.state.ledger) {
      const cosmosAddress = await this.state.ledger.getCosmosAddress();
      this.setState({ cosmosAddress });
      this.props.setAddress(cosmosAddress);
    }
  };

  placeBid = async (auctionId: string, bid: string) => {
    console.log(
      `Place bid for auction: ${auctionId} - bid: ${bid} - address: ${this.props.address}`,
    );
    const tx = createCosmosTransactionMessage(COSMOS_MESSAGE_TYPES.PLACE_BID, {
      auction_id: auctionId,
      bidder: this.props.address,
      bid: {
        denom: "uatom",
        amount: new BigNumber(bid).multipliedBy(1e6).toString(),
      },
    });
    this.setState({ confirmTx: true, tx });
    this.signMessage(tx);
  };

  signMessage = async (tx: any) => {
    // @ts-ignore
    const { accountInformation } = this.props.accountInformation;
    const { value } = accountInformation;
    const txDetail = {
      msg: tx,
      memo: "Bid transaction",
      fee: {
        gas: "200000",
        amount: [
          {
            denom: "ubtc",
            amount: "20",
          },
        ],
      },
    };
    const signMessage = createSignMessage(txDetail, {
      sequence: value.sequence,
      account_number: value.account_number,
      chain_id: "auction-chain",
    });
    if (this.state.ledger) {
      const pubKey = await this.state.ledger.getPubKey();
      const result = await this.state.ledger.sign(signMessage);

      const signature = result.toString("base64");
      const txPost = createCosmosPostTx(
        txDetail,
        signature,
        pubKey.toString("base64"),
      );

      this.postTransaction(txPost);
    }
  };

  postTransaction = async (tx: any) => {
    console.log("Posting transaction!");
    console.log(tx);

    const url = "http://10.100.0.157:9191/boom";
    // const u = "https://192.168.0.121:443/txs";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx: tx.value,
          mode: "block",
          // mode: "async",
        }),
      });
      const data = await response.json();
      console.log("Result:");
      console.log(data);

      Toast.success("Transaction submitted!");
      this.setState({
        confirmTx: false,
        tx: null,
      });
    } catch (err) {
      Toast.danger("Failed to submit transaction...");
    }
  };
}

const LedgerProvider = composeWithProps<any>(
  withTheme,
  withState,
  withAccountsQuery,
)(LedgerProviderClass);

const withLedger = withContextFactory<LedgerContext, LedgerContextProps>(
  ledgerContext,
);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { ledgerContext, LedgerProvider, withLedger };
