import React from "react";
import { identity } from "./utils";

/**
 * "with"Context factory helper.
 *
 * TODO: Add tests.
 */
export const withContextFactory = <
  IContext extends {},
  IProviderProps extends {}
>(
  context: React.Context<IContext>,
  mapContextToProps: (ctx: IContext) => any = identity,
) => {
  return function providerMethod<
    P extends IProviderProps,
    R = Omit<P, keyof IProviderProps>
  >(
    Component: React.ComponentClass<P> | React.StatelessComponent<P>,
  ): React.FunctionComponent<R> {
    return (props: R) => {
      return (
        <context.Consumer>
          {value => <Component {...props} {...mapContextToProps(value)} />}
        </context.Consumer>
      );
    };
  };
};
