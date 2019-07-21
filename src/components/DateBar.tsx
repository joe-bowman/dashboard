import { Colors, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import styled from "styled-components";

import { useDateTime } from "tools/hooks-utils";

/** ===========================================================================
 * Component
 * ============================================================================
 */

const DateTimeComponent: React.FC = () => {
  const date = useDateTime(new Date());
  return (
    <DateBar>
      <Icon color={Colors.GRAY3} icon={IconNames.CALENDAR} />
      <DateText>{date.toLocaleDateString()} -</DateText>
      <Icon color={Colors.GRAY3} icon={IconNames.TIME} />
      <DateText>{date.toLocaleTimeString()}</DateText>
    </DateBar>
  );
};

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const DateBar = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DateText = styled.p`
  margin: 0;
  margin-left: 6px;
  margin-right: 6px;
  padding: 0;
  font-size: 14px;
  color: ${Colors.GRAY3};
`;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default DateTimeComponent;
