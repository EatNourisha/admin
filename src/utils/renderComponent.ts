// @ts-nocheck
import React from "react";

const renderComponent = <C extends string, P>(
  children: React.ReactNode | React.ReactChildren,
  component?: C,
  props?: P
) =>
  React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (
      (component && (child.type as any).name === component) ||
      (component && (child.type as any).displayName === component)
    ) {
      return props ? React.cloneElement(child, props) : child;
    }

    if (!component && props) {
      return React.cloneElement(child, props);
    }
    return;
  });

export default renderComponent;
