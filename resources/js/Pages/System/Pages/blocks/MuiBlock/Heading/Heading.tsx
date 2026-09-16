import React from "react";
import { Typography } from "@mui/material";
import type { ComponentConfig } from "@puckeditor/core";

export type HeadingProps = {
  text: string;
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align: "left" | "center" | "right" | "justify" | "inherit";
};

export type PHeadingProps = HeadingProps;

export const PHeading: ComponentConfig<HeadingProps> = {
  label: "Heading",
  fields: {
    text: {
      type: "text",
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
    text: "Heading",
    variant: "h1",
    align: "inherit",
  },
  render: ({ text, variant, align }) => {
    return (
      <Typography variant={variant} align={align}>
        {text}
      </Typography>
    );
  },
};

export const Heading = PHeading;
export default PHeading;
