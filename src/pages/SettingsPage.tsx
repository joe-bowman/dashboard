import { Button, Classes, H3, MenuItem, Switch } from "@blueprintjs/core";
import React from "react";

import { Select } from "@blueprintjs/select";
import { View } from "components/Common";
import { ThemeProps, withTheme } from "containers/ThemeContainer";
import styled from "styled-components";
import { composeWithProps } from "tools/utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IProps extends ThemeProps {}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

const SettingsPage: React.FC<IProps> = (props: IProps) => {
  const { themeProps } = props;
  const { isDarkTheme, toggleDarkTheme } = themeProps;
  return (
    <View>
      <H3 style={{ fontWeight: "bold" }}>Settings</H3>
      <View style={{ marginTop: 15 }}>
        <Switch
          large
          checked={isDarkTheme}
          style={{ marginTop: 20, width: 215 }}
          label={isDarkTheme ? "Disable Dark Theme" : "Enable Dark Theme"}
          onChange={
            isDarkTheme
              ? () => toggleDarkTheme(false)
              : () => toggleDarkTheme(true)
          }
        />
      </View>

    </View>
  );
};

/** ===========================================================================
 * Styles & Helpers
 * ============================================================================
 */

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 30px;
`;

const Text = styled.p`
  margin: 0;
  padding: 0;
  margin-left: 12px;
`;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps(withTheme)(SettingsPage);
