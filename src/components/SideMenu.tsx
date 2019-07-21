import {
  Button,
  Classes,
  Dialog,
  Drawer,
  H6,
  Icon,
  IconName,
  Text,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React, { ChangeEvent, useState } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";

import { View } from "components/Common";
import { COLORS } from "constants/colors";
import { StateContextProps, withState } from "containers/StateContainer";
import { ThemeProps, withTheme } from "containers/ThemeContainer";
import { composeWithProps, onActiveRoute } from "tools/utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface ComponentProps {}

interface IProps
  extends ComponentProps,
    RouteComponentProps,
    StateContextProps,
    ThemeProps {}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

const SideMenuComponent: React.FC<IProps> = (props: IProps) => {
  const { location, themeProps } = props;
  const { isDarkTheme, isDesktop } = themeProps;
  const { pathname } = location;

  const [isMenuOpen, setMenuState] = useState(false);
  const close = () => setMenuState(false);
  const open = () => setMenuState(true);

  const [isAddressDialogOpen, setAddressDialogState] = useState(false);
  const closeAddressDialog = () => setAddressDialogState(false);
  const openAddressDialog = () => setAddressDialogState(true);

  const [address, setAddress] = useState(props.address);
  const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const linkAddress = () => {
    closeAddressDialog();
    // props.history.push(`/dashboard/total?address=${address}`);
    props.setAddress(address);
  };

  const AddressDialog = (
    <React.Fragment>
      <Dialog
        className={isDarkTheme ? Classes.DARK : ""}
        autoFocus
        usePortal
        enforceFocus
        canEscapeKeyClose
        canOutsideClickClose
        icon="new-link"
        isOpen={isAddressDialogOpen}
        onClose={closeAddressDialog}
        title="Link Blockchain Address"
      >
        <View className={Classes.DIALOG_BODY}>
          <H6>Enter an blockchain address to get started.</H6>
          <View
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <form
              onSubmit={(event: ChangeEvent<HTMLFormElement>) => {
                event.preventDefault();
                linkAddress();
              }}
            >
              <Input
                value={address}
                onSubmit={linkAddress}
                onChange={handleChangeAddress}
              />
              <Button
                text="LINK"
                type="submit"
                onClick={linkAddress}
                style={{
                  marginLeft: 8,
                  background: COLORS.CHORUS,
                  color: COLORS.LIGHT_WHITE,
                }}
              />
            </form>
          </View>
        </View>
      </Dialog>
    </React.Fragment>
  );

  /**
   * Render Desktop Navigation Menu
   */
  if (isDesktop) {
    return (
      <DesktopNavigationContainer className={Classes.DARK}>
        {AddressDialog}
        <View>
          <NavItem path={pathname} title="Auction" icon={IconNames.DOLLAR} />
        </View>
        <View>
          <NavItem path={pathname} title="Settings" icon={IconNames.COG} />
          <AddressContainer>
            <Text>
              <AddressTitle>Connect an Address</AddressTitle>
            </Text>
            <NetworkAddressBox
              onClick={openAddressDialog}
              id="link-address-button"
            >

              <Address>
                {address
                  ? `${address.slice(0, 8)}...${address.slice(35)}`
                  : "Link Your Address"}
              </Address>
            </NetworkAddressBox>
          </AddressContainer>
        </View>
      </DesktopNavigationContainer>
    );
  }

  /**
   * Render Mobile Navigation Menu:
   */
  return (
    <React.Fragment>
      <MobileNavContainer>
        <Icon
          onClick={open}
          iconSize={25}
          color="#F5F8FA"
          icon={IconNames.MENU}
        />
      </MobileNavContainer>
      <Drawer
        position="left"
        onClose={close}
        isOpen={isMenuOpen}
        title=""
        className={Classes.DARK}
        style={{
          backgroundColor: "rgb(26, 26, 39)",
        }}
      >
        <NavItem
          path={pathname}
          closeHandler={close}
          title="Dashboard"
          icon={IconNames.TIMELINE_BAR_CHART}
        />
        <NavItem
          path={pathname}
          closeHandler={close}
          title="Wallet"
          icon={IconNames.CREDIT_CARD}
        />
        <NavItem
          path={pathname}
          closeHandler={close}
          title="Governance"
          icon={IconNames.OFFICE}
        />
        <NavItem
          path={pathname}
          closeHandler={close}
          title="Auction"
          icon={IconNames.DOLLAR}
        />
        <NavItem
          path={pathname}
          closeHandler={close}
          title="Settings"
          icon={IconNames.COG}
        />
        <NavItem
          path={pathname}
          closeHandler={close}
          title="Help"
          icon={IconNames.INFO_SIGN}
        />
        <NavItem
          path={pathname}
          closeHandler={close}
          title="Logout"
          icon={IconNames.LOG_OUT}
        />
      </Drawer>
    </React.Fragment>
  );
};

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const DesktopNavigationContainer = styled.div`
  top: 0;
  left: 0;
  bottom: 0;
  width: 250px;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${COLORS.NAVIGATION_BACKGROUND};
`;

const MobileNavContainer = styled.div`
  z-index: 25;
  position: fixed;
  padding-left: 16px;
  padding-right: 16px;
  top: 0;
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.NAVIGATION_BACKGROUND};
`;

interface INavItemProps {
  title: string;
  icon: IconName | any /* TODO: Remove any */;
  path: string;
  closeHandler?: () => void;
}

const NavItem = ({ title, icon, path, closeHandler }: INavItemProps) => {
  const active = onActiveRoute(path, title);
  return (
    <Link
      to={`/${title.toLowerCase()}`}
      onClick={closeHandler}
      id={`${title}-navigation-link`}
    >
      <NavLinkContainer activeRoute={active}>
        <Icon
          icon={icon}
          iconSize={20}
          color={active ? COLORS.LIGHT_WHITE : COLORS.LIGHT_GRAY}
          className="nav-icon"
          style={{ marginRight: 14 }}
        />
        <NavTitle activeRoute={active}>{title}</NavTitle>
      </NavLinkContainer>
    </Link>
  );
};

const NavTitle = styled.h4`
  margin: 0;
  color: ${(props: { activeRoute: boolean }) =>
    props.activeRoute ? COLORS.LIGHT_WHITE : COLORS.LIGHT_GRAY};
`;

const NavLinkContainer = styled.div`
  height: 50px;
  padding-left: 22px;
  display: flex;
  align-items: center;

  background: ${(props: { activeRoute: boolean }) =>
    props.activeRoute
      ? `linear-gradient(
    to right,
    ${COLORS.CHORUS},
    ${COLORS.CHORUS_BACKGROUND_INTERMEDIATE},
    ${COLORS.NAVIGATION_BACKGROUND_ACTIVE_GRADIENT_END}
  )`
      : ""};

  &:hover {
    cursor: pointer;
    background-color: ${COLORS.NAVIGATION_BACKGROUND_HOVER};
  }

  &:hover ${NavTitle} {
    color: white;
  }
`;

const AddressContainer = styled.div`
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 10px;
  display: block;
  height: 125px;
  background-color: ${COLORS.ADDRESS_BACKGROUND};
  border-top: 1px solid ${COLORS.ADDRESS_LINE};
`;

const AddressTitle = styled.p`
  font-weight: bold;
`;

const NetworkAddressBox = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: row;
`;

const Address = styled.div`
  width: 175px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${COLORS.ADDRESS_LINE};

  &:hover {
    cursor: pointer;
    background-color: ${COLORS.NAVIGATION_BACKGROUND_HOVER};
  }
`;

const NetworkImage = styled.img`
  margin-right: 5px;
  width: 32px;
`;

const Input = (props: {
  value: string;
  onSubmit: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <input
    dir="auto"
    autoFocus
    type="text"
    value={props.value}
    style={{ width: 400 }}
    onChange={props.onChange}
    placeholder="Enter an address"
    className={`${Classes.INPUT} .modifier :modifier`}
  />
);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withTheme,
  withRouter,
  withState,
)(SideMenuComponent);
