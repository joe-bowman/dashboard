import { graphql } from "react-apollo";

import {
  AccountInformationDocument,
  AuctionsDocument,
  CoinsDocument,
  HeightDocument,
} from "graphql/nova";

export const withCoinsQuery = graphql(CoinsDocument, { name: "coins" });

export const withAuctionsQuery = graphql(AuctionsDocument, {
  name: "auctions",
  options: {
    pollInterval: 1000,
  },
});

export const withAccountsQuery = graphql(AccountInformationDocument, {
  name: "accountInformation",
  options: {
    pollInterval: 1000,
  },
});

export const withHeightQuery = graphql(HeightDocument, {
  name: "height",
  options: {
    pollInterval: 1000,
  },
});
