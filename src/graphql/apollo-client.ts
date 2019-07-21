import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";

/** ===========================================================================
 * Apollo Client Setup
 * ----------------------------------------------------------------------------
 * ApolloClient is used for fetching and managing data from GraphQL.
 * ============================================================================
 */

const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache(),
});

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default client;
