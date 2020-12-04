import {debounce, cloneDeepWith} from 'lodash';
import {NativeEventEmitter, NativeModules} from 'react-native';

import {AndroidAutoTemplate} from './types';

const invalidate = debounce((screenName: string) => {
  NativeModules.CarModule.invalidate(screenName);
}, 50);

const eventEmitter = new NativeEventEmitter(NativeModules.CarModule);

function prepareTemplate(name: string, template: AndroidAutoTemplate) {
  let currentIndex = 0;
  const callbacks = new Map<number, Function>();

  const templateClone = cloneDeepWith(template, (value: any) => {
    if (typeof value === 'function') {
      currentIndex++;
      callbacks.set(currentIndex, value);
      return currentIndex;
    }

    return undefined;
  });

  const callbackFromNative = ({id, ...event}) => {
    NativeModules.CarModule.setEventCallback(name, callbackFromNative);
    const callback = callbacks.get(id);
    
    if (callback) {
      callback(event);
    }
  };
  return [name, templateClone, callbackFromNative] as const;
}

export const AndroidAutoModule = {
  init() {},
  eventEmitter,
  mapNavigate(address: string) {
    NativeModules.CarModule.mapNavigate(address);
  },
  reload() {
    NativeModules.CarModule.reload();
  },
  finishCarApp() {
    NativeModules.CarModule.finishCarApp();
  },
  invalidate,
  setTemplate: debounce((name: string, template: AndroidAutoTemplate) => {
    NativeModules.CarModule.setTemplate(...prepareTemplate(name, template));
    invalidate(name);
  }, 50),
  pushScreen: (name: string, template: AndroidAutoTemplate) => {
    NativeModules.CarModule.pushScreen(...prepareTemplate(name, template));
  },
  popScreen: () => {
    NativeModules.CarModule.popScreen();
  },
  toast: (text: string, duration = 1) => {
    NativeModules.CarModule.toast(text, duration);
  },
};
