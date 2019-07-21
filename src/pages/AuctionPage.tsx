import { Button, Card, Colors, H2, H3, H5, H6, Icon } from "@blueprintjs/core";
import React, { useState } from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import styled, { CSSProperties } from "styled-components";

import { COIN_ICONS } from "components/CoinIcons";
import {
  Balance,
  Centered,
  SpaceLoader,
  TextInput,
  View,
} from "components/Common";
import DateTimeComponent from "components/DateBar";
import Toast from "components/Toast";
import { COLORS } from "constants/colors";
import { LedgerContextProps, withLedger } from "containers/LedgerContainer";
import { StateContextProps, withState } from "containers/StateContainer";
import { ThemeProps, withTheme } from "containers/ThemeContainer";
import {
  IAuctionResponse,
  IPrice,
  IQuery,
  IQueryPricesArgs,
  PricesDocument,
  usePricesQuery,
} from "graphql/nova";
import {
  withAuctionsQuery,
  withCoinsQuery,
  withHeightQuery,
} from "graphql/queries";
import {
  composeWithProps,
  convertDenom,
  findCurrencyFromCoinsList,
  getBidMessage,
  getMarketPrice,
} from "tools/utils";
import { IAuctionsResult, IHeightResult } from "../../global";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

type IAuctions = IQuery["auctions"] | undefined;
type IHeight = IQuery["height"] | undefined;

interface ComponentProps {}

interface IProps
  extends LedgerContextProps,
    StateContextProps,
    ThemeProps,
    WithApolloClient<{}> {
  coins: { coins: IQuery["coins"] };
  auctions: IAuctionsResult<IAuctions>;
  height: IHeightResult<IHeight>;
}

interface IState {
  height: number;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class AuctionPage extends React.Component<IProps, IState> {
  render(): JSX.Element {
    const { height } = this.props.height;
    const { auctions } = this.props.auctions;
    const endTime = getAuctionEndTime(auctions, height);
    const finalEndTime = getFinalAuctionTime(auctions);
    const auctionClosed = Number(endTime) < 0;

    // console.log(
    //   `closed: ${auctionClosed} - end: ${endTime}, finalEndTime: ${finalEndTime}`,
    // );

    /**
     * Discount = current BID / current market value of LOT:BID currency %
     */

    const auctionsUnavailable = !auctions || auctions.length === 0;

    return (
      <View>
        <H3 style={{ fontWeight: "bold" }}>Auction</H3>
        <DateTimeComponent />
        <H5 style={{ marginTop: 12, marginBottom: 12 }}>
          Wallet Balances: <Balance address={this.props.address} />
        </H5>
        {auctionsUnavailable ? (
          <Centered style={{ marginTop: 150, flexDirection: "column" }}>
            <SpaceLoader />
            <H5 style={{ marginTop: 35 }}>No auctions in progress...</H5>
          </Centered>
        ) : (
          <React.Fragment>
            <Container>
              <H3 style={{ margin: 0 }}>Bid on tokens earned by the Hub</H3>
              <Card style={{ padding: 5, marginTop: 20, marginBottom: 20 }}>
                <H2 style={{ margin: 12 }}>
                  {auctionClosed
                    ? `Auction Closed`
                    : `${endTime} Blocks Remaining`}
                </H2>
              </Card>
              <p style={{ margin: 0 }}>Left in this auction period</p>
              <CircleLeft />
              <CircleRight />
            </Container>
            <View style={{ marginTop: 50 }}>
              <AuctionRow>
                <AuctionRowTitleItem>
                  <H6>TOKEN</H6>
                  <EmptyPlaceholder />
                </AuctionRowTitleItem>
                <AuctionRowTitleItem>
                  <H6>POOL SIZE</H6>
                  <p style={{ fontSize: 12 }}>(in native tokens)</p>
                </AuctionRowTitleItem>
                <AuctionRowTitleItem>
                  <H6>CURRENT HIGHEST BID</H6>
                  <EmptyPlaceholder />
                </AuctionRowTitleItem>
                <AuctionRowTitleItem>
                  <H6>DISCOUNT FROM MARKET PRICE</H6>
                  <p style={{ fontSize: 12 }}>(according to CoinGecko)</p>
                </AuctionRowTitleItem>
              </AuctionRow>
              {auctions &&
                auctions.length &&
                auctions
                  .slice()
                  .reverse()
                  .map((auction: IAuctionResponse) => (
                    <TokenAuction
                      key={auction.value.baseAuction.auction_id}
                      auction={auction}
                      coins={this.props.coins}
                      finalEndTime={finalEndTime}
                      auctionClosed={auctionClosed}
                      placeBid={this.props.placeBid}
                      isDarkTheme={this.props.themeProps.isDarkTheme}
                      connectLedger={this.props.connectLedgerDevice}
                    />
                  ))}
            </View>
          </React.Fragment>
        )}
      </View>
    );
  }

  pollForAuctionUpdates = () => {
    console.log("Polling for auction updates...");
    // TODO: Implement this function.
  };

  fetchPriceData = async ({
    currency,
    versus,
  }: IQueryPricesArgs): Promise<number | undefined> => {
    try {
      const result = await this.props.client.query<{ prices: IPrice }>({
        query: PricesDocument,
        variables: {
          currency: "bitcoin",
          versus: "ltc",
        },
      });
      return result.data.prices.price;
    } catch (err) {
      console.log(`Error fetching price data for pair: ${currency}-${versus}`);
      return;
    }
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

interface TokenAuctionProps {
  coins: { coins: IQuery["coins"] };
  auction: IAuctionResponse;
  finalEndTime: string;
  auctionClosed: boolean;
  isDarkTheme: boolean;
  connectLedger: () => Promise<void>;
  placeBid: (auctionId: string, bid: string) => Promise<void>;
}

const TokenAuction: React.FC<TokenAuctionProps> = (
  props: TokenAuctionProps,
) => {
  const { coins } = props.coins;
  const auction = props.auction.value.baseAuction;
  const { end_time } = props.auction.value.baseAuction;
  const { bid, lot } = auction;

  const isActive = end_time === props.finalEndTime && !props.auctionClosed;

  const [isOpen, toggleOpen] = useState(false);
  const [userBid, setBid] = useState("");

  const biddingCurrency = findCurrencyFromCoinsList(bid.denom, coins);
  const lotCurrency = findCurrencyFromCoinsList(lot.denom, coins);

  const { data } = usePricesQuery({
    variables: {
      currency: biddingCurrency.id,
      versus: lotCurrency.symbol,
    },
    pollInterval: 1000,
  });

  let price;
  if (data && data.prices) {
    price = data.prices.price;
  }

  // console.log(`${biddingCurrency.symbol}-${lotCurrency.symbol}`);

  const handleToggleOpen = () => {
    toggleOpen(!isOpen);
  };

  const handlePlaceBid = async () => {
    if (isNaN(Number(userBid)) || Number(userBid) <= 0) {
      Toast.info("Please enter a number to bid");
    } else {
      await props.connectLedger();
      await props.placeBid(auction.auction_id, userBid);
    }
  };

  // @ts-ignore
  const logo = COIN_ICONS[lotCurrency.name];

  return (
    <Card style={getAuctionCardStyles(isActive, props.isDarkTheme)}>
      <AuctionRow onClick={isActive ? handleToggleOpen : () => null}>
        <AuctionRowItem>
          <img alt={`${lotCurrency.name} icon`} width={24} src={logo} />
          <Text style={{ marginLeft: 8, fontWeight: "bold" }}>
            {lotCurrency.name} {!isActive ? "(Closed)" : ""}
          </Text>
        </AuctionRowItem>
        <AuctionRowItem>
          <Text>
            {convertDenom(lot.amount)} {lotCurrency.name}
          </Text>
        </AuctionRowItem>
        <AuctionRowItem>
          <Text>{convertDenom(bid.amount)} ATOM</Text>
        </AuctionRowItem>
        <AuctionRowItem>
          <Text>{getMarketPrice(lot.amount, bid.amount, price)}</Text>
        </AuctionRowItem>
        <AuctionRowItem>
          <Icon
            icon="caret-down"
            style={{ position: "absolute", right: 15, top: 25 }}
          />
        </AuctionRowItem>
      </AuctionRow>
      <AuctionRow>
        {isOpen && !props.auctionClosed && (
          <ActionContainer>
            <EmptyAuctionRowItem />
            <AuctionRowTitleItem>
              <H6 style={{ margin: 0, marginTop: 6 }}>Your bid:</H6>
              <EmptyPlaceholder />
            </AuctionRowTitleItem>
            <AuctionRowTitleItem style={{ flexDirection: "column" }}>
              <BidBlock>
                <TextInput
                  value={userBid}
                  onChange={setBid}
                  placeholder="Bid"
                  style={{ margin: 0 }}
                />
                <H6 style={{ margin: 0, marginTop: 6, marginLeft: 12 }}>
                  ATOMs
                </H6>
              </BidBlock>
              <p
                style={{
                  textAlign: "left",
                  fontSize: 12,
                  marginTop: 8,
                  paddingRight: 20,
                }}
              >
                {getBidMessage(lot.amount, userBid, price)}
              </p>
            </AuctionRowTitleItem>
            <AuctionRowTitleItem>
              <Button
                text="Place Bid"
                onClick={handlePlaceBid}
                style={{
                  width: 150,
                  marginTop: 0,
                  background: COLORS.CHORUS,
                  color: COLORS.LIGHT_WHITE,
                }}
              />
              <EmptyPlaceholder />
            </AuctionRowTitleItem>
            <AuctionRowTitleItem />
          </ActionContainer>
        )}
      </AuctionRow>
    </Card>
  );
};

const EmptyPlaceholder = () => <p style={{ visibility: "hidden" }}>empty</p>;

const BidBlock = styled.div`
  min-width: 250px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
`;

const ActionContainer = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  padding-top: 18px;
  flex-direction: row;
  background: ${(props: { theme: ThemeProps }) =>
    props.theme.mode === "dark" ? Colors.DARK_GRAY3 : Colors.LIGHT_GRAY4};
`;

const Container = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 25px;
  padding-bottom: 25px;
  margin-top: 25px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  background: ${(props: { theme: ThemeProps }) =>
    props.theme.mode === "dark" ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY4};
`;

const AuctionRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const AuctionRowTitleItem = styled.div`
  min-height: 50px;
  min-width: 250px;
  padding-left: 12px;
  display: flex;
  flex-direction: column;
`;

const AuctionRowItem = styled.div`
  min-height: 65px;
  min-width: 250px;
  padding-left: 12px;
  display: flex;
  align-items: center;
`;

const EmptyAuctionRowItem = () => (
  <AuctionRowItem style={{ visibility: "hidden" }} />
);

const getAuctionCardStyles = (
  isActive: boolean,
  isDarkTheme: boolean,
): CSSProperties => ({
  marginTop: 12,
  minHeight: 65,
  padding: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "relative",
  background: !isActive
    ? isDarkTheme
      ? Colors.DARK_GRAY2
      : Colors.LIGHT_GRAY3
    : "",
});

const Text = styled.p`
  margin: 0;
  padding: 0;
`;

const CircleLeft = styled.div`
  position: absolute;
  left: -75px;
  top: -215px;
  width: 315px;
  height: 315px;
  border-radius: 50%;
  background: ${(props: { theme: ThemeProps }) =>
    props.theme.mode === "dark" ? Colors.DARK_GRAY4 : Colors.LIGHT_GRAY5};
`;

const CircleRight = styled.div`
  position: absolute;
  right: -45px;
  bottom: -150px;
  width: 215px;
  height: 215px;
  border-radius: 50%;
  background: ${(props: { theme: ThemeProps }) =>
    props.theme.mode === "dark" ? Colors.DARK_GRAY4 : Colors.LIGHT_GRAY5};
`;

const getAuctionEndTime = (auctions: IAuctions, height: IHeight) => {
  if (height && auctions && auctions.length) {
    const currentHeight = height.result.sync_info.latest_block_height;
    const endTime = auctions[auctions.length - 1].value.baseAuction.end_time;
    return Number(endTime) - Number(currentHeight);
  } else {
    return null;
  }
};

const getFinalAuctionTime = (auctions: IAuctions): string => {
  if (auctions && auctions.length) {
    const endTime = auctions[auctions.length - 1].value.baseAuction.end_time;
    return endTime;
  } else {
    return "";
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withTheme,
  withLedger,
  withState,
  withApollo,
  withAuctionsQuery,
  withCoinsQuery,
  withHeightQuery,
)(AuctionPage);
