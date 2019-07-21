import BigNumber from "bignumber.js";
import queryString from "query-string";
import { compose } from "react-apollo";

import { IBalance, IBalanceQuery, ICoin, IQuery } from "graphql/nova";

/** =======================================================
 * Common Util Helper Methods
 * ========================================================
 */

/**
 * Assert a condition cannot occur. Used for writing exhaustive switch
 * blocks (e.g. see unwrapOkValueIfExists).
 */
export const assertUnreachable = (x: never): never => {
  throw new Error(
    `Panicked! Received a value which should not exist: ${JSON.stringify(x)}`,
  );
};

/**
 * Determine if a given route link is on the current active route.
 *
 * @param pathName string current actual route
 * @param routeName string route link
 * @returns true if the route link is the active route
 */
export const onActiveRoute = (pathName: string, routeName: string) => {
  return pathName.toLowerCase().includes(routeName.toLowerCase());
};

/**
 * Custom compose method which allows typed props information to be
 * passed up to the consumer.
 *
 * TODO: Add tests.
 */
export const composeWithProps = <T extends {}>(
  ...funcs: ReadonlyArray<(P?: any) => any>
) => {
  return (component: any) => {
    return (props: T) => compose(...funcs)(component)(props);
  };
};

/**
 * Simple identity function.
 *
 * TODO: Add tests.
 */
export const identity = <T extends {}>(x: T): T => x;

/**
 * Parse the query parameters from the current url.
 *
 * TODO: Add tests.
 */
export const getQueryParamsFromUrl = (paramString: string) => {
  return queryString.parse(paramString);
};

/**
 * Return initial address from address derived from query string parameters.
 *
 * TODO: Add tests and improve type-checking.
 */
export const getInitialAddress = (
  maybeAddress: any,
  storageKey: string,
): string => {
  if (typeof maybeAddress === "string") {
    return maybeAddress;
  } else {
    const value = localStorage.getItem(storageKey);
    if (value) {
      const setting = JSON.parse(value);
      if (typeof setting === "string") {
        return setting;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
};

/**
 * Helper to return the mintscan URL for a transaction.
 */
export const getMintScanUrlForTx = (txHash: string) => {
  return `https://www.mintscan.io/txs/${txHash}`;
};

/**
 * Parse and format the ATOMs balance.
 *
 * NOTE: WIP.
 */
export const formatAtomsBalance = (data: IBalanceQuery | undefined) => {
  try {
    if (!data || !data.balance) {
      throw new Error("No data received");
    } else {
      return data.balance
        .map((balanceData: IBalance) => {
          const { amount, denom } = balanceData;

          let bal = new BigNumber(amount);
          bal = bal.dividedBy(1e6);

          const tokenFormatter = new Intl.NumberFormat("en-US", {
            style: "decimal",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });

          const result = tokenFormatter.format(bal.toNumber());

          return `${result} ${denom.slice(1).toUpperCase()}`;
        })
        .join(", ");

      // let balance = new BigNumber(data.balance[0].amount);
      // balance = balance.dividedBy(1e6);

      // const tokenFormatter = new Intl.NumberFormat("en-US", {
      //   style: "decimal",
      //   maximumFractionDigits: 2,
      // });

      // const result = tokenFormatter.format(balance.toNumber());
      // return result;
    }
  } catch (err) {
    return "";
  }
};

export const findCurrencyFromCoinsList = (
  denom: string,
  coins: IQuery["coins"],
): ICoin => {
  const defaultCoin = {
    id: "",
    symbol: "",
    name: "",
  };

  if (!coins) {
    return defaultCoin;
  }

  const currencySymbol = denom.slice(1);
  const coin = coins.find((c: any) => c.symbol === currencySymbol);

  return coin ? coin : defaultCoin;
};

export const convertDenom = (denom: string) => {
  const n = new BigNumber(denom);
  return n.dividedBy(1e6).toString();
};

export const getMarketPrice = (
  lotSize: string,
  bestBid: string,
  exchangeRate?: number,
): string => {
  if (!exchangeRate || !lotSize) {
    return "";
  }

  const rate = new BigNumber(exchangeRate);
  const lot = new BigNumber(lotSize).dividedBy(1e6);
  const bid = new BigNumber(bestBid).dividedBy(1e6);

  // console.log(`lot: ${lot.toString()}, rate: ${rate.toString()}`);

  const marketPrice = lot.dividedBy(rate);

  // Discount: market price - bid / market price * 100
  const diff = marketPrice.minus(bid);
  const discount = diff
    .dividedBy(marketPrice)
    .multipliedBy(100)
    .toString();

  return `${marketPrice
    .toString()
    .slice(0, 5)} ATOMs - current bid is ${discount.slice(0, 8)}% off`;
};

export const getBidMessage = (
  lotSize: string,
  bidSize: string,
  exchangeRate?: number,
): string => {
  if (!exchangeRate || !lotSize || !bidSize) {
    return "";
  }

  const rate = new BigNumber(exchangeRate);
  const lot = new BigNumber(lotSize).dividedBy(1e6);
  const bid = new BigNumber(bidSize);

  const marketPrice = lot.dividedBy(rate);

  // console.log(
  //   `bid: ${bid.toString()} lot: ${lot.toString()}, rate: ${rate.toString()}, price: ${marketPrice.toString()}`,
  // );

  // Discount: market price - bid / market price * 100
  const diff = marketPrice.minus(bid);
  const discount = diff
    .dividedBy(marketPrice)
    .multipliedBy(100)
    .toString();

  return `With this bid you will pay ${bidSize} ATOMs which is ${discount.slice(
    0,
    6,
  )}% below the current market price.`;
};

// 2 ATOMs
// 43 ATOMs

// 0.00973 ETH for auction
// ---> 0.545898 ATOMs

// 0.01774697 ATOM/ETH exchange
// 0.00973 * 0.01751717 = 0.0001704420641 ATOM

// 235.42 ETH/USD
// 0.00973 * 235.43 = 2.29 USD

// 4.13 ATOM/USD

// 0.00973 ETH = $2.26
// 1.8 ATOMs to buy auction

// 1 ATOM = 0.01751717 ETH
// 0.00973 ETH / 0.01751717
// 0.00973/0.01751717
