import useWindowSize from "@rehooks/window-size";
import React, { createContext, useState } from "react";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";

import { withContextFactory } from "tools/context-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const THEME_STORAGE_KEY = "CHORUS_THEME_STORAGE_KEY";

export type THEME = "dark" | "light";

export interface ThemeProps {
  mode: THEME;
  isDesktop: boolean;
}

export interface IThemeContext {
  isDarkTheme: boolean;
  isDesktop: boolean;
  toggleDarkTheme: (isDarkTheme: boolean) => void;
}

export interface ThemeProps {
  themeProps: IThemeContext;
}

const initialContext = {
  isDarkTheme: true,
  isDesktop: true,
  toggleDarkTheme: (isDarkTheme: boolean) => {
    return;
  },
};

const setGlobalTheme = (theme: THEME, isDesktop: boolean) => ({
  isDesktop,
  mode: theme,
});

/** ===========================================================================
 * Context Setup
 * ============================================================================
 */

const ThemeContext = createContext<IThemeContext>(initialContext);

/**
 * State Provider to track light|dark theme. The default is light
 * theme. Themes are supported out of the box by BlueprintJS. This component
 * re-renders when the window resizes.
 */
const ThemeProvider = (props: { children: JSX.Element }) => {
  const [isDarkTheme, toggleTheme] = useState(getInitialThemeState());

  const toggleDarkTheme = (state: boolean) => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
    toggleTheme(state);
  };

  const window = useWindowSize();
  const isDesktop = window.innerWidth > 768;
  return (
    <ThemeContext.Provider value={{ isDarkTheme, isDesktop, toggleDarkTheme }}>
      <StyledComponentsThemeProvider
        theme={setGlobalTheme(isDarkTheme ? "dark" : "light", isDesktop)}
      >
        {props.children}
      </StyledComponentsThemeProvider>
    </ThemeContext.Provider>
  );
};

const withTheme = withContextFactory<IThemeContext, ThemeProps>(
  ThemeContext,
  (ctx: IThemeContext) => ({
    themeProps: ctx,
  }),
);

/** ===========================================================================
 * Helpers
 * ============================================================================
 */

const getInitialThemeState = () => {
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  if (value) {
    const setting = JSON.parse(value);
    if (typeof setting === "boolean") {
      return setting;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { ThemeContext, ThemeProvider, withTheme };
