import React from "react";
import { Paper as MuiPaper } from "@mui/material";
import type { ComponentConfig } from "@puckeditor/core";
import { DropZone } from "@puckeditor/core";

export type PaperProps = {
  variant: "elevation" | "outlined";
  elevation: number;
  square: boolean;
  padding?: number;
};

export type PPaperProps = PaperProps;

export const PPaper: ComponentConfig<PaperProps> = {
  label: "Paper",
  fields: {
    variant: {
      type: "radio",
      label: "Variant",
      options: [
        { value: "elevation", label: "Elevated" },
        { value: "outlined", label: "Outlined" },
      ],
    },
    elevation: {
      type: "number",
      label: "Elevation (0-24)",
      min: 0,
      max: 24,
    },
    square: {
      type: "radio",
      label: "Shape",
      options: [
        { value: true, label: "Square" },
        { value: false, label: "Rounded" },
      ],
    },
    padding: {
      type: "number",
      label: "Padding (0-8)",
      min: 0,
      max: 8,
    },
  },
  defaultProps: {
    variant: "elevation",
    elevation: 1,
    square: false,
    padding: 2,
  },
  render: ({
    variant,
    elevation,
    square,
    padding = 2,
    id,
  }: PaperProps & { id?: string }) => {
    return (
      <MuiPaper
        variant={variant}
        square={square}
        elevation={elevation}
        sx={{ p: padding }}
      >
        <DropZone zone={id ? `zone-${id}` : "paper-content"} />
      </MuiPaper>
    );
  },
};

export const Paper = PPaper;
export default PPaper;
