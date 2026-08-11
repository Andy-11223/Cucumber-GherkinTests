// support/widget-root.ts
import { Page, FrameLocator } from "@playwright/test";
import { page } from "./hooks";

export type WidgetRoot = Page | FrameLocator;

let widgetRoot: WidgetRoot | null = null;
let currentBrand: string = "unknown-brand";

export const setWidgetRoot = (root: WidgetRoot) => {
  widgetRoot = root;
};

export const getWidgetRoot = (): WidgetRoot => {
  return widgetRoot ?? page;
};

export const resetWidgetRoot = () => {
  widgetRoot = null;
  currentBrand = "unknown-brand";
};

export const setCurrentBrand = (brand: string) => {
  currentBrand = brand;
};

export const getCurrentBrand = (): string => currentBrand;