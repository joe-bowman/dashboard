import { InMemoryCache } from "apollo-cache-inmemory";
import { ObservableQueryFields, OperationVariables } from "react-apollo";
import { NetworkStatus } from "apollo-client";

/**
 * Include any global TypeScript types or modules here.
 */

type Empty = null | undefined;

type Maybe<T> = T | Empty;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IAuctionsResult<TData = any, TVariables = OperationVariables>
  extends ObservableQueryFields<TData, TVariables> {
  client: ApolloClient<InMemoryCache>;
  auctions: TData | undefined;
  error?: ApolloError;
  loading: boolean;
  networkStatus: NetworkStatus;
}

export interface IHeightResult<TData = any, TVariables = OperationVariables>
  extends ObservableQueryFields<TData, TVariables> {
  client: ApolloClient<InMemoryCache>;
  height: TData | undefined;
  error?: ApolloError;
  loading: boolean;
  networkStatus: NetworkStatus;
}
