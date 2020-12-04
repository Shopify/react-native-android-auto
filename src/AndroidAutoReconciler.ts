import React from 'react';
import Reconciler from 'react-reconciler';

import {AndroidAutoModule} from './AndroidAuto';
import {AndroidAutoElement, ExtractElementByType, RootContainer} from './types';
import {RootView} from './AndroidAutoReact';

type Container = RootContainer | AndroidAutoElement;

type ScreenContainer = ExtractElementByType<'screen'>;

function applyProps(instance: object, allProps: object) {
  for (const [key, value] of Object.entries(allProps)) {
    if (key !== 'children') {
      instance[key] = value;
    }
  }
}

function addChildren(parentInstance: Container | null) {
  if (parentInstance && !('children' in parentInstance)) {
    (parentInstance as any).children = [];
  }

  return (parentInstance as any)?.children ?? [];
}

function appendChild(parentInstance: Container, child: Container) {
  addChildren(parentInstance).push(child);
}

function removeChild(parentInstance: Container, child: Container): void {
  addChildren(parentInstance);

  if ('children' in parentInstance) {
    parentInstance.children = (parentInstance.children as any).filter(
      (currentChild: Container) => currentChild !== child,
    );
  }
}

function insertBefore(parentInstance: Container, child: Container, beforeChild: Container): void {
  addChildren(parentInstance);

  if ('children' in parentInstance && Array.isArray(parentInstance.children)) {
    const index = parentInstance.children.indexOf(beforeChild as any);
    parentInstance.children.splice(index, 1, child as any);
  }
}

const Renderer = Reconciler<Container, any, AndroidAutoElement, any, any, any, any, any, any, any, any, any>({
  createInstance(type, allProps, _rootContainerInstance, _hostContext, _internalInstanceHandle) {
    const {children, ...props} = allProps;

    const element = {
      type,
      ...(children ? {children: []} : {}),
      ...props,
    };

    return element;
  },
  now: Date.now,
  setTimeout,
  clearTimeout,
  noTimeout: false,
  isPrimaryRenderer: true,
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,

  // Context
  getRootHostContext() {
    return {};
  },
  getChildHostContext(context) {
    return context;
  },

  // Instances
  createTextInstance(_text, _fragment) {
    return {};
  },

  // Updates
  commitTextUpdate(_text, _oldText, _newText) {
    // noop
  },
  prepareUpdate(_instance, _type, oldProps, newProps) {
    const updateProps: Record<string, unknown> = {};

    let needsUpdate = false;

    for (const key in oldProps) {
      if (!Reflect.has(oldProps, key) || key === 'children') {
        continue;
      }

      if (!(key in newProps)) {
        needsUpdate = true;
        updateProps[key] = undefined;
      } else if (oldProps[key] !== newProps[key]) {
        needsUpdate = true;
        updateProps[key] = newProps[key];
      }
    }

    for (const key in newProps) {
      if (!Reflect.has(newProps, key) || key === 'children') {
        continue;
      }

      if (!(key in oldProps)) {
        needsUpdate = true;
        updateProps[key] = newProps[key];
      }
    }

    return needsUpdate ? updateProps : null;
  },
  commitUpdate: applyProps,

  // Update root
  appendChildToContainer: appendChild,
  insertInContainerBefore: insertBefore,
  removeChildFromContainer: removeChild,

  // Update children
  appendInitialChild: appendChild,
  appendChild,
  insertBefore,
  removeChild,

  // Deferred callbacks
  scheduleDeferredCallback() {},
  cancelDeferredCallback() {},

  ...({
    schedulePassiveEffects(fn: Function) {
      return setTimeout(fn);
    },
    cancelPassiveEffects(handle: number) {
      clearTimeout(handle);
    },
  } as {}),

  // Unknown
  finalizeInitialChildren() {
    return false;
  },
  shouldSetTextContent() {
    return false;
  },
  getPublicInstance() {},
  shouldDeprioritizeSubtree() {
    return false;
  },
  prepareForCommit() {
    return null;
  },
  resetAfterCommit(containerInfo: Container) {
    if (containerInfo.type !== 'root-container') {
      console.log('Root container must be a RootContainer');
      return;
    }

    const topStack = containerInfo.stack[containerInfo.stack.length - 1];
    console.log('Sending updated UI to native thread', topStack);

    if (!topStack) {
      console.log('Stack is still empty');
      return;
    }

    const node = containerInfo.children?.find(
      item => item.type === 'screen' && item.name === topStack.name,
    ) as ScreenContainer;

    if (!node || !node.children) {
      console.log(`${topStack.name} screen has no render method or its render method returns nothing`, node);
      return;
    }

    const template = Array.isArray(node.children) ? node.children.flat().filter(Boolean)[0] : node.children;

    if (!template) {
      console.log('No proper template found for route ', topStack.name);
      return;
    }

    if (
      containerInfo.prevStack.length === containerInfo.stack.length ||
      (containerInfo.prevStack.length === 0 && node.name === 'root')
    ) {
      if (containerInfo.prevStack.length === 0) {
        console.log('Initial render of root');
      }
      AndroidAutoModule.setTemplate(node.name, template);
    } else if (containerInfo.stack.length > containerInfo.prevStack.length) {
      AndroidAutoModule.pushScreen(node.name, template);
    } else if (containerInfo.stack.length === containerInfo.prevStack.length - 1) {
      AndroidAutoModule.popScreen();
      AndroidAutoModule.setTemplate(node.name, template);
    }

    containerInfo.prevStack = containerInfo.stack;
  },
  commitMount() {},
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  clearContainer(container?: Container) {
    if (container && 'children' in container) {
      container.children = [];
    }
  },
});

export function render(element: React.ReactNode) {
  function callReconciler(element: React.ReactNode, containerInfo: RootContainer) {
    const root = Renderer.createContainer(containerInfo as any, false, false);

    AndroidAutoModule.init();

    Renderer.updateContainer(element, root, null, () => {
      AndroidAutoModule.invalidate('root');
    });

    Renderer.getPublicRootInstance(root);
  }

  AndroidAutoModule.eventEmitter.addListener('android_auto:ready', () => {
    console.log('CarContext: Ready');
    const initialStack = [];
    const containerInfo = {
      type: 'root-container',
      stack: initialStack,
      prevStack: initialStack,
    } as RootContainer;

    callReconciler(React.createElement(RootView, {containerInfo}, element), containerInfo);
  });
}
