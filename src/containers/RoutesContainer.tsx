import { Classes } from "@blueprintjs/core";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import styled from "styled-components";

import SideMenuComponent from "components/SideMenu";
import { COLORS } from "constants/colors";
import { ThemeProps, withTheme } from "containers/ThemeContainer";
import AuctionPage from "pages/AuctionPage";
import SettingsPage from "pages/SettingsPage";
import { composeWithProps } from "tools/utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface ComponentProps {}

interface IProps extends ComponentProps, ThemeProps {}

/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * Routes configuration for the app.
 * ============================================================================
 */

const RoutesContainer: React.FC<IProps> = (props: IProps) => {
  return (
    <Container className={props.themeProps.isDarkTheme ? Classes.DARK : ""}>
      <SideMenuComponent />
      <PageContainer>
        <Route key={4} path="/auction" component={AuctionPage} />
        <Route key={5} path="/settings" component={SettingsPage} />
      </PageContainer>
    </Container>
  );
};

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const Container = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  overflow: scroll;
  background-color: ${(props: { theme: ThemeProps }) =>
    props.theme.mode === "dark"
      ? COLORS.DARK_THEME_BACKGROUND
      : COLORS.LIGHT_WHITE};
`;

const PageContainer = styled.div`
  padding: ${(props: { theme: ThemeProps }) =>
    props.theme.isDesktop ? "25px" : "15px"};
  margin-top: ${(props: { theme: ThemeProps }) =>
    props.theme.isDesktop ? "0px" : "55px"};
  margin-left: ${(props: { theme: ThemeProps }) =>
    props.theme.isDesktop ? "250px" : "0px"};
`;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withTheme)(RoutesContainer);
