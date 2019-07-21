import React, { ChangeEvent } from "react";
import styled, { CSSProperties } from "styled-components";

import { Classes } from "@blueprintjs/core";
import { ThemeProps, withTheme } from "containers/ThemeContainer";
import { useBalanceQuery } from "graphql/nova";
import { formatAtomsBalance } from "tools/utils";

/** ===========================================================================
 * Common components shared throughout the application
 * ============================================================================
 */

const View = styled.div``;

const Centered = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpaceLoader = withTheme((props: ThemeProps) => {
  const dark = props.themeProps.isDarkTheme;
  return (
    <div className={`lds-roller ${dark ? "dark-theme" : ""}`}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
});

const TextInput = (props: {
  style?: CSSProperties;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => (
  <input
    dir="auto"
    autoFocus
    type="text"
    value={props.value}
    style={props.style}
    placeholder={props.placeholder}
    onChange={(event: ChangeEvent<HTMLInputElement>) => {
      props.onChange(event.target.value);
    }}
    className={`${Classes.INPUT} .modifier :modifier`}
  />
);

interface BalanceProps {
  address: string;
}

const Balance: React.FC<BalanceProps> = (props: BalanceProps) => {
  const { address } = props;
  const { data, loading } = useBalanceQuery({
    variables: {
      address,
    },
    pollInterval: 1000,
  });

  const balance = formatAtomsBalance(data);
  return <span>{loading ? "..." : balance.toLocaleString()}</span>;
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { View, Centered, SpaceLoader, TextInput, Balance };
