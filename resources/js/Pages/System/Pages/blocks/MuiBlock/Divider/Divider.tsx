import React from "react";
import { Divider as MuiDivider } from "@mui/material";
import type { ComponentConfig } from "@puckeditor/core";

export type DividerProps = {
  variant: "fullWidth" | "inset" | "middle";
  orientation: "horizontal" | "vertical";
};

export type PDividerProps = DividerProps;

export const PDivider: ComponentConfig<DividerProps> = {
  label: "Divider",
  fields: {
    variant: {
      type: "radio",
      label: "Variant",
      options: [
        { label: "Full Width", value: "fullWidth" },
        { label: "Inset", value: "inset" },
        { label: "Middle", value: "middle" },
      ],
    },
    orientation: {
      type: "radio",
      label: "Orientation",
      options: [
        { label: "Horizontal", value: "horizontal" },
        { label: "Vertical", value: "vertical" },
      ],
    },
  },
  defaultProps: {
    variant: "fullWidth",
    orientation: "horizontal",
  },
  render: ({ variant, orientation }) => {
    return (
      <MuiDivider
        variant={variant}
        orientation={orientation}
        sx={{
          my: orientation === "horizontal" ? 1.5 : 0,
          mx: orientation === "vertical" ? 1.5 : 0,
        }}
      />
    );
  },
};

export const Divider = PDivider;
export default PDivider;
