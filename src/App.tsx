import { FocusStyleManager } from "@blueprintjs/core";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { BrowserRouter as ReactRouterV4 } from "react-router-dom";

import { LedgerProvider } from "containers/LedgerContainer";
import RoutesContainer from "containers/RoutesContainer";
import { StateProvider } from "containers/StateContainer";
import { ThemeProvider } from "containers/ThemeContainer";
import client from "graphql/apollo-client";

/* Disable focus styles for mouse events */
FocusStyleManager.onlyShowFocusOnTabs();

/* Require Blueprint CSS assets */
require("@blueprintjs/core/lib/css/blueprint.css");
require("@blueprintjs/icons/lib/css/blueprint-icons.css");
require("normalize.css");


/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * This is the top level App file which renders the app.
 *
 * TODO: This is very nested...
 * ============================================================================
 */

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <ReactRouterV4>
          <ThemeProvider>
            <StateProvider>
              <LedgerProvider>
                <RoutesContainer />
              </LedgerProvider>
            </StateProvider>
          </ThemeProvider>
        </ReactRouterV4>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default App;
