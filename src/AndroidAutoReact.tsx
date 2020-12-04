import React from 'react';

import {ExtractElementByType, Route, RootContainer} from './types';

type ScreenContainer = ExtractElementByType<'screen'>;

const NavigationContext = React.createContext({
  push: (() => {}) as (routeName: string, routeParams?: any) => void,
  pop: (() => {}) as () => void,
  registerScreen: (() => {}) as (screen: ScreenContainer) => void,
  stack: [] as Route[],
});

export function RootView(props: {containerInfo: RootContainer; children?: React.ReactNode}) {
  const [stack, setStack] = React.useState<Route[]>([]);
  const screens = React.useRef<ScreenContainer[]>([]);

  const push = React.useCallback(
    (routeName: string, params?: any) => {
      setStack(prev => {
        const screen = screens.current.find(({name}) => name === routeName);

        if (!screen) {
          console.log(`Cannot navigatie to ${routeName}: Route does not exist`);
          return prev;
        }

        const newState = [
          ...prev,
          {
            name: routeName,
            key: prev.length,
            render: screen.render,
            routeParams: params ?? {},
          },
        ];

        props.containerInfo.stack = newState;

        return newState;
      });
    },
    [props.containerInfo],
  );

  const pop = React.useCallback(() => {
    setStack(prev => {
      if (prev.length === 1) {
        return prev;
      }
      const newState = prev.slice(0, -1);
      props.containerInfo.stack = newState;

      return newState;
    });
  }, [props.containerInfo]);

  const registerScreen = React.useCallback(
    (screen: ScreenContainer) => {
      screens.current.push(screen);

      if (screen.name === 'root') {
        push('root');
      }
    },
    [push],
  );

  const navigationContextValue = React.useMemo(() => {
    return {
      push,
      pop,
      registerScreen,
      stack,
    };
  }, [push, pop, registerScreen, stack]);

  return <NavigationContext.Provider value={navigationContextValue}>{props.children}</NavigationContext.Provider>;
}

export const useCarNavigation = () => React.useContext(NavigationContext);

export const Screen = React.memo(function Screen({name, render}: {name: string; render: ScreenContainer['render']}) {
  const navigation = useCarNavigation();
  React.useEffect(() => {
    navigation.registerScreen({
      name,
      render,
      type: 'screen',
    } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
});

export const ScreenManager = React.memo(function ScreenManager({children}: {children: any}) {
  const {stack} = useCarNavigation();

  return (
    <>
      {children}
      {stack.map(({render, routeParams, ...item}) => {
        return React.createElement('screen', item, render && React.createElement(render, {routeParams} as any));
      })}
    </>
  );
});
