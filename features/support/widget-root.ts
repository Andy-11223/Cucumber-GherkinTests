// support/widget-root.ts
import { Page, FrameLocator } from "@playwright/test";
import { page } from "./hooks";

export type WidgetRoot = Page | FrameLocator;

let widgetRoot: WidgetRoot | null = null;

export const setWidgetRoot = (root: WidgetRoot) => {
  widgetRoot = root;
};

export const getWidgetRoot = (): WidgetRoot => {
  return widgetRoot ?? page; // resolve `page` lazily, only when actually called
};

export const resetWidgetRoot = () => {
  widgetRoot = null;
};