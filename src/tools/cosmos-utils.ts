import { IBalance } from "graphql/nova";

/** ===========================================================================
 * Constants related to the Cosmos Network
 * ============================================================================
 */

export enum COSMOS_MESSAGE_TYPES {
  "PLACE_BID" = "auction/MsgPlaceBid",
  "VOTE" = "cosmos-sdk/MsgVote",
  "DELEGATE" = "cosmos-sdk/MsgDelegate",
  "WITHDRAW_DELEGATION_REWARD" = "cosmos-sdk/MsgWithdrawDelegationReward",
}

const CHAIN_ID = "cosmoshub-2";
const DEFAULT_GAS = 150000;
const DEFAULT_GAS_PRICE = 0.01;

/** ===========================================================================
 * Helper Methods
 * ============================================================================
 */

interface BidValue {
  auction_id: string;
  bid: IBalance;
  bidder: string;
}

/**
 * Create a transaction message.
 *
 * TODO: Add tests.
 */
export const createCosmosTransactionMessage = (
  type: COSMOS_MESSAGE_TYPES,
  value: BidValue,
) => {
  return [{ type, value }];
};

interface AddressInfo {
  sequence: string;
  account_number: string;
}

/**
 * Get the request metadata object for a transaction.
 *
 * TODO: Add tests.
 */
export const createTransactionRequestMetadata = (
  addressInfo: AddressInfo,
  address: string,
) => {
  const gas = DEFAULT_GAS;
  const gasPrice = DEFAULT_GAS_PRICE;
  return {
    from: address,
    chain_id: CHAIN_ID,
    generate_only: false,
    fees: String(gas * gasPrice),
    sequence: String(addressInfo.sequence),
    account_number: String(addressInfo.account_number),
  };
};

export const createCosmosPostTx = (
  txMsg: any,
  signature: string,
  pubKey: string,
) => {
  return {
    type: "auth/StdTx",
    value: {
      ...txMsg,
      signatures: [
        {
          pub_key: {
            type: "tendermint/PubKeySecp256k1",
            value: pubKey,
          },
          signature,
        },
      ],
      memo: "Place bid",
    },
  };
};
