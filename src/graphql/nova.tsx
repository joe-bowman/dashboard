import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";
import * as ReactApolloHooks from "react-apollo-hooks";
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export interface IAccount {
  __typename?: "Account";
  readonly account_number: Scalars["String"];
  readonly address: Scalars["String"];
  readonly coins: Maybe<ReadonlyArray<IAccountCoin>>;
  readonly public_key: Scalars["String"];
  readonly sequence: Scalars["String"];
}

export interface IAccountCoin {
  __typename?: "AccountCoin";
  readonly denom: Scalars["String"];
  readonly amount: Scalars["String"];
}

export interface IAccountInformation {
  __typename?: "AccountInformation";
  readonly type: Scalars["String"];
  readonly value: IAccount;
}

export interface IAuction {
  __typename?: "Auction";
  readonly auction_id: Scalars["String"];
  readonly lot: IBalance;
  readonly bid: IBalance;
  readonly bidder: Scalars["String"];
  readonly end_time: Scalars["String"];
  readonly max_end_time: Scalars["String"];
  readonly time_remaining: Scalars["Int"];
  readonly auction_status: Scalars["String"];
}

export interface IAuctionResponse {
  __typename?: "AuctionResponse";
  readonly type: Scalars["String"];
  readonly value: IBaseAuction;
}

export interface IBalance {
  __typename?: "Balance";
  readonly denom: Scalars["String"];
  readonly amount: Scalars["String"];
}

export interface IBaseAuction {
  __typename?: "BaseAuction";
  readonly baseAuction: IAuction;
}

export interface ICoin {
  __typename?: "Coin";
  readonly id: Scalars["String"];
  readonly symbol: Scalars["String"];
  readonly name: Scalars["String"];
}

export interface IDelegation {
  __typename?: "Delegation";
  readonly delegator_address: Scalars["String"];
  readonly validator_address: Scalars["String"];
  readonly shares: Scalars["String"];
  readonly height: Scalars["Int"];
}

export interface IPrice {
  __typename?: "Price";
  readonly price: Scalars["Float"];
}

export interface IQuery {
  __typename?: "Query";
  readonly balance: Maybe<ReadonlyArray<IBalance>>;
  readonly accountInformation: IAccountInformation;
  readonly stakingDelegations: Maybe<ReadonlyArray<IDelegation>>;
  readonly prices: IPrice;
  readonly coins: Maybe<ReadonlyArray<ICoin>>;
  readonly auctions: Maybe<ReadonlyArray<IAuctionResponse>>;
  readonly height: IStatus;
}

export interface IQueryBalanceArgs {
  address: Scalars["String"];
}

export interface IQueryAccountInformationArgs {
  address: Scalars["String"];
}

export interface IQueryStakingDelegationsArgs {
  address: Scalars["String"];
}

export interface IQueryPricesArgs {
  currency: Scalars["String"];
  versus: Scalars["String"];
}

export interface IResult {
  __typename?: "Result";
  readonly sync_info: ISyncInfo;
}

export interface IStatus {
  __typename?: "Status";
  readonly result: IResult;
}

export interface ISyncInfo {
  __typename?: "SyncInfo";
  readonly latest_block_height: Scalars["String"];
}
export interface IAccountInformationQueryVariables {
  address: Scalars["String"];
}

export type IAccountInformationQuery = { readonly __typename?: "Query" } & {
  readonly accountInformation: {
    readonly __typename?: "AccountInformation";
  } & Pick<IAccountInformation, "type"> & {
      readonly value: { readonly __typename?: "Account" } & Pick<
        IAccount,
        "account_number" | "address" | "public_key" | "sequence"
      > & {
          readonly coins: Maybe<
            ReadonlyArray<
              { readonly __typename?: "AccountCoin" } & Pick<
                IAccountCoin,
                "denom" | "amount"
              >
            >
          >;
        };
    };
};

export interface IAuctionsQueryVariables {}

export type IAuctionsQuery = { readonly __typename?: "Query" } & {
  readonly auctions: Maybe<
    ReadonlyArray<
      { readonly __typename?: "AuctionResponse" } & Pick<
        IAuctionResponse,
        "type"
      > & {
          readonly value: { readonly __typename?: "BaseAuction" } & {
            readonly baseAuction: { readonly __typename?: "Auction" } & Pick<
              IAuction,
              | "auction_id"
              | "bidder"
              | "end_time"
              | "max_end_time"
              | "time_remaining"
              | "auction_status"
            > & {
                readonly lot: { readonly __typename?: "Balance" } & Pick<
                  IBalance,
                  "denom" | "amount"
                >;
                readonly bid: { readonly __typename?: "Balance" } & Pick<
                  IBalance,
                  "denom" | "amount"
                >;
              };
          };
        }
    >
  >;
};

export interface IBalanceQueryVariables {
  address: Scalars["String"];
}

export type IBalanceQuery = { readonly __typename?: "Query" } & {
  readonly balance: Maybe<
    ReadonlyArray<
      { readonly __typename?: "Balance" } & Pick<IBalance, "denom" | "amount">
    >
  >;
};

export interface ICoinsQueryVariables {}

export type ICoinsQuery = { readonly __typename?: "Query" } & {
  readonly coins: Maybe<
    ReadonlyArray<
      { readonly __typename?: "Coin" } & Pick<ICoin, "id" | "symbol" | "name">
    >
  >;
};

export interface IHeightQueryVariables {}

export type IHeightQuery = { readonly __typename?: "Query" } & {
  readonly height: { readonly __typename?: "Status" } & {
    readonly result: { readonly __typename?: "Result" } & {
      readonly sync_info: { readonly __typename?: "SyncInfo" } & Pick<
        ISyncInfo,
        "latest_block_height"
      >;
    };
  };
};

export interface IPricesQueryVariables {
  currency: Scalars["String"];
  versus: Scalars["String"];
}

export type IPricesQuery = { readonly __typename?: "Query" } & {
  readonly prices: { readonly __typename?: "Price" } & Pick<IPrice, "price">;
};

export interface IStakingDelegationsQueryVariables {
  address: Scalars["String"];
}

export type IStakingDelegationsQuery = { readonly __typename?: "Query" } & {
  readonly stakingDelegations: Maybe<
    ReadonlyArray<
      { readonly __typename?: "Delegation" } & Pick<
        IDelegation,
        "delegator_address" | "validator_address" | "shares" | "height"
      >
    >
  >;
};

export const AccountInformationDocument = gql`
  query accountInformation($address: String!) {
    accountInformation(address: $address) {
      type
      value {
        account_number
        address
        coins {
          denom
          amount
        }
        public_key
        sequence
      }
    }
  }
`;
export type AccountInformationComponentProps = Omit<
  ReactApollo.QueryProps<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >,
  "query"
> &
  (
    | { variables: IAccountInformationQueryVariables; skip?: false }
    | { skip: true });

export const AccountInformationComponent = (
  props: AccountInformationComponentProps,
) => (
  <ReactApollo.Query<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >
    query={AccountInformationDocument}
    {...props}
  />
);

export type IAccountInformationProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >
> &
  TChildProps;
export function withAccountInformation<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IAccountInformationQuery,
    IAccountInformationQueryVariables,
    IAccountInformationProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IAccountInformationQuery,
    IAccountInformationQueryVariables,
    IAccountInformationProps<TChildProps>
  >(AccountInformationDocument, {
    alias: "withAccountInformation",
    ...operationOptions,
  });
}

export function useAccountInformationQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IAccountInformationQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IAccountInformationQuery,
    IAccountInformationQueryVariables
  >(AccountInformationDocument, baseOptions);
}
export type AccountInformationQueryHookResult = ReturnType<
  typeof useAccountInformationQuery
>;
export const AuctionsDocument = gql`
  query auctions {
    auctions {
      type
      value {
        baseAuction {
          auction_id
          lot {
            denom
            amount
          }
          bid {
            denom
            amount
          }
          bidder
          end_time
          max_end_time
          time_remaining
          auction_status
        }
      }
    }
  }
`;
export type AuctionsComponentProps = Omit<
  ReactApollo.QueryProps<IAuctionsQuery, IAuctionsQueryVariables>,
  "query"
>;

export const AuctionsComponent = (props: AuctionsComponentProps) => (
  <ReactApollo.Query<IAuctionsQuery, IAuctionsQueryVariables>
    query={AuctionsDocument}
    {...props}
  />
);

export type IAuctionsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IAuctionsQuery, IAuctionsQueryVariables>
> &
  TChildProps;
export function withAuctions<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IAuctionsQuery,
    IAuctionsQueryVariables,
    IAuctionsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IAuctionsQuery,
    IAuctionsQueryVariables,
    IAuctionsProps<TChildProps>
  >(AuctionsDocument, {
    alias: "withAuctions",
    ...operationOptions,
  });
}

export function useAuctionsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<IAuctionsQueryVariables>,
) {
  return ReactApolloHooks.useQuery<IAuctionsQuery, IAuctionsQueryVariables>(
    AuctionsDocument,
    baseOptions,
  );
}
export type AuctionsQueryHookResult = ReturnType<typeof useAuctionsQuery>;
export const BalanceDocument = gql`
  query balance($address: String!) {
    balance(address: $address) {
      denom
      amount
    }
  }
`;
export type BalanceComponentProps = Omit<
  ReactApollo.QueryProps<IBalanceQuery, IBalanceQueryVariables>,
  "query"
> &
  ({ variables: IBalanceQueryVariables; skip?: false } | { skip: true });

export const BalanceComponent = (props: BalanceComponentProps) => (
  <ReactApollo.Query<IBalanceQuery, IBalanceQueryVariables>
    query={BalanceDocument}
    {...props}
  />
);

export type IBalanceProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IBalanceQuery, IBalanceQueryVariables>
> &
  TChildProps;
export function withBalance<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IBalanceQuery,
    IBalanceQueryVariables,
    IBalanceProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IBalanceQuery,
    IBalanceQueryVariables,
    IBalanceProps<TChildProps>
  >(BalanceDocument, {
    alias: "withBalance",
    ...operationOptions,
  });
}

export function useBalanceQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<IBalanceQueryVariables>,
) {
  return ReactApolloHooks.useQuery<IBalanceQuery, IBalanceQueryVariables>(
    BalanceDocument,
    baseOptions,
  );
}
export type BalanceQueryHookResult = ReturnType<typeof useBalanceQuery>;
export const CoinsDocument = gql`
  query coins {
    coins {
      id
      symbol
      name
    }
  }
`;
export type CoinsComponentProps = Omit<
  ReactApollo.QueryProps<ICoinsQuery, ICoinsQueryVariables>,
  "query"
>;

export const CoinsComponent = (props: CoinsComponentProps) => (
  <ReactApollo.Query<ICoinsQuery, ICoinsQueryVariables>
    query={CoinsDocument}
    {...props}
  />
);

export type ICoinsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<ICoinsQuery, ICoinsQueryVariables>
> &
  TChildProps;
export function withCoins<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    ICoinsQuery,
    ICoinsQueryVariables,
    ICoinsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    ICoinsQuery,
    ICoinsQueryVariables,
    ICoinsProps<TChildProps>
  >(CoinsDocument, {
    alias: "withCoins",
    ...operationOptions,
  });
}

export function useCoinsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<ICoinsQueryVariables>,
) {
  return ReactApolloHooks.useQuery<ICoinsQuery, ICoinsQueryVariables>(
    CoinsDocument,
    baseOptions,
  );
}
export type CoinsQueryHookResult = ReturnType<typeof useCoinsQuery>;
export const HeightDocument = gql`
  query height {
    height {
      result {
        sync_info {
          latest_block_height
        }
      }
    }
  }
`;
export type HeightComponentProps = Omit<
  ReactApollo.QueryProps<IHeightQuery, IHeightQueryVariables>,
  "query"
>;

export const HeightComponent = (props: HeightComponentProps) => (
  <ReactApollo.Query<IHeightQuery, IHeightQueryVariables>
    query={HeightDocument}
    {...props}
  />
);

export type IHeightProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IHeightQuery, IHeightQueryVariables>
> &
  TChildProps;
export function withHeight<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IHeightQuery,
    IHeightQueryVariables,
    IHeightProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IHeightQuery,
    IHeightQueryVariables,
    IHeightProps<TChildProps>
  >(HeightDocument, {
    alias: "withHeight",
    ...operationOptions,
  });
}

export function useHeightQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<IHeightQueryVariables>,
) {
  return ReactApolloHooks.useQuery<IHeightQuery, IHeightQueryVariables>(
    HeightDocument,
    baseOptions,
  );
}
export type HeightQueryHookResult = ReturnType<typeof useHeightQuery>;
export const PricesDocument = gql`
  query prices($currency: String!, $versus: String!) {
    prices(currency: $currency, versus: $versus) {
      price
    }
  }
`;
export type PricesComponentProps = Omit<
  ReactApollo.QueryProps<IPricesQuery, IPricesQueryVariables>,
  "query"
> &
  ({ variables: IPricesQueryVariables; skip?: false } | { skip: true });

export const PricesComponent = (props: PricesComponentProps) => (
  <ReactApollo.Query<IPricesQuery, IPricesQueryVariables>
    query={PricesDocument}
    {...props}
  />
);

export type IPricesProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<IPricesQuery, IPricesQueryVariables>
> &
  TChildProps;
export function withPrices<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IPricesQuery,
    IPricesQueryVariables,
    IPricesProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IPricesQuery,
    IPricesQueryVariables,
    IPricesProps<TChildProps>
  >(PricesDocument, {
    alias: "withPrices",
    ...operationOptions,
  });
}

export function usePricesQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<IPricesQueryVariables>,
) {
  return ReactApolloHooks.useQuery<IPricesQuery, IPricesQueryVariables>(
    PricesDocument,
    baseOptions,
  );
}
export type PricesQueryHookResult = ReturnType<typeof usePricesQuery>;
export const StakingDelegationsDocument = gql`
  query stakingDelegations($address: String!) {
    stakingDelegations(address: $address) {
      delegator_address
      validator_address
      shares
      height
    }
  }
`;
export type StakingDelegationsComponentProps = Omit<
  ReactApollo.QueryProps<
    IStakingDelegationsQuery,
    IStakingDelegationsQueryVariables
  >,
  "query"
> &
  (
    | { variables: IStakingDelegationsQueryVariables; skip?: false }
    | { skip: true });

export const StakingDelegationsComponent = (
  props: StakingDelegationsComponentProps,
) => (
  <ReactApollo.Query<
    IStakingDelegationsQuery,
    IStakingDelegationsQueryVariables
  >
    query={StakingDelegationsDocument}
    {...props}
  />
);

export type IStakingDelegationsProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<
    IStakingDelegationsQuery,
    IStakingDelegationsQueryVariables
  >
> &
  TChildProps;
export function withStakingDelegations<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    IStakingDelegationsQuery,
    IStakingDelegationsQueryVariables,
    IStakingDelegationsProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    IStakingDelegationsQuery,
    IStakingDelegationsQueryVariables,
    IStakingDelegationsProps<TChildProps>
  >(StakingDelegationsDocument, {
    alias: "withStakingDelegations",
    ...operationOptions,
  });
}

export function useStakingDelegationsQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    IStakingDelegationsQueryVariables
  >,
) {
  return ReactApolloHooks.useQuery<
    IStakingDelegationsQuery,
    IStakingDelegationsQueryVariables
  >(StakingDelegationsDocument, baseOptions);
}
export type StakingDelegationsQueryHookResult = ReturnType<
  typeof useStakingDelegationsQuery
>;
