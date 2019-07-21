import React, { createContext, useState } from "react";

import { IAccountInformation, useAccountInformationQuery } from "graphql/nova";
import { RouteComponentProps, withRouter } from "react-router";
import { withContextFactory } from "tools/context-utils";
import { getInitialAddress, getQueryParamsFromUrl } from "tools/utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const ADDRESS_KEY = "ADDRESS_KEY";

export interface StateContext {
  address: string;
  accountInformation?: IAccountInformation;
  setAddress: (address: string) => void;
}

export type StateContextProps = StateContext;

interface ProviderProps extends RouteComponentProps {
  children: JSX.Element;
}

const initialContext: StateContext = {
  address: "",
  setAddress: (address: string) => {
    /* no-op */
  },
};

/** ===========================================================================
 * Context & Provider Setup
 * ============================================================================
 */

const stateContext = createContext<StateContext>(initialContext);

const StateProviderFn = (props: ProviderProps) => {
  const params = getQueryParamsFromUrl(props.location.search);
  const [address, setAddress] = useState(
    getInitialAddress(params.address, ADDRESS_KEY),
  );

  const handleSetAddress = (addressValue: string) => {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(addressValue));
    setAddress(addressValue);
  };

  const { data, loading, error } = useAccountInformationQuery({
    variables: {
      address,
    },
  });

  let accountInformation;
  if (data && data.accountInformation && !loading && !error) {
    accountInformation = data.accountInformation;
  }

  return (
    <stateContext.Provider
      value={{ address, setAddress: handleSetAddress, accountInformation }}
    >
      {props.children}
    </stateContext.Provider>
  );
};

const StateProvider = withRouter(StateProviderFn);

const withState = withContextFactory<StateContext, StateContextProps>(
  stateContext,
);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { stateContext, StateProvider, withState };
