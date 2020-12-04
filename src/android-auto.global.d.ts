import React from "react";

import { AndroidAutoElement, ExtractElementByType } from "./types";

type NativeToJSXElement<Type extends AndroidAutoElement["type"]> = Omit<
  ExtractElementByType<Type>,
  "children" | "type"
> & {
  children?: React.ReactNode;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "screen-manager": NativeToJSXElement<"screen-manager">;
      screen: NativeToJSXElement<"screen">;
      "list-template": NativeToJSXElement<"list-template">;
      "item-list": NativeToJSXElement<"item-list">;
      "place-list-map-template": NativeToJSXElement<"place-list-map-template">;
      action: NativeToJSXElement<"action">;
      "pane-template": NativeToJSXElement<"pane-template">;
      row: NativeToJSXElement<"row">;
    }
  }
}

export {};
