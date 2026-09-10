import React from "react";
import { Typography as MuiTypography } from "@mui/material";
import type { ComponentConfig } from "@puckeditor/core";

export type TypographyProps = {
  text: string;
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "subtitle1"
    | "caption";
  align: "left" | "center" | "right" | "justify" | "inherit";
};

export type PTypographyProps = TypographyProps;

export const PTypography: ComponentConfig<TypographyProps> = {
  label: "Typography",
  fields: {
    text: {
      type: "textarea",
      label: "Text",
    },
    variant: {
      type: "select",
      label: "Variant",
      options: [
        { value: "h1", label: "H1" },
        { value: "h2", label: "H2" },
        { value: "h3", label: "H3" },
        { value: "h4", label: "H4" },
        { value: "h5", label: "H5" },
        { value: "h6", label: "H6" },
        { value: "body1", label: "Body 1" },
        { value: "body2", label: "Body 2" },
        { value: "subtitle1", label: "Subtitle 1" },
        { value: "caption", label: "Caption" },
      ],
    },
    align: {
      type: "radio",
      label: "Align",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
        { value: "justify", label: "Justify" },
        { value: "inherit", label: "Inherit" },
      ],
    },
  },
  defaultProps: {
    text: "Text",
    variant: "body1",
    align: "inherit",
  },
  render: ({ text, variant, align }) => {
    return (
      <MuiTypography variant={variant} align={align}>
        {text}
      </MuiTypography>
    );
  },
};

export const Typography = PTypography;
export default PTypography;
