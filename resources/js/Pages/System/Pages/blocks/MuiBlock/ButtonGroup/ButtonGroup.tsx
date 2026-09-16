import React from "react";
import { ButtonGroup as MuiButtonGroup, Button } from "@mui/material";
import type { ComponentConfig } from "@puckeditor/core";

export type ButtonGroupItem = {
  text: string;
  href?: string;
  disabled?: boolean;
};

export type ButtonGroupProps = {
  variant: "contained" | "outlined" | "text";
  color: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  size: "small" | "medium" | "large";
  orientation: "horizontal" | "vertical";
  buttons: ButtonGroupItem[];
};

export type PButtonGroupProps = ButtonGroupProps;

export const PButtonGroup: ComponentConfig<ButtonGroupProps> = {
  label: "Button Group",
  fields: {
    variant: {
      label: "Variant",
      type: "radio",
      options: [
        { value: "contained", label: "Contained" },
        { value: "outlined", label: "Outlined" },
        { value: "text", label: "Text" },
      ],
    },
    color: {
      label: "Color",
      type: "select",
      options: [
        { value: "primary", label: "Primary" },
        { value: "secondary", label: "Secondary" },
        { value: "error", label: "Error" },
        { value: "warning", label: "Warning" },
        { value: "info", label: "Info" },
        { value: "success", label: "Success" },
      ],
    },
    size: {
      label: "Size",
      type: "radio",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
    orientation: {
      type: "select",
      label: "Orientation",
      options: [
        { value: "horizontal", label: "Horizontal" },
        { value: "vertical", label: "Vertical" },
      ],
    },
    buttons: {
      type: "array",
      label: "Buttons",
      getItemSummary: (item, idx) =>
        item.text || `Button ${(idx !== undefined ? idx : 0) + 1}`,
      arrayFields: {
        text: {
          label: "Text",
          type: "text",
        },
        href: {
          label: "Link URL (href)",
          type: "text",
        },
        disabled: {
          label: "Disabled",
          type: "select",
          options: [
            { value: true, label: "True" },
            { value: false, label: "False" },
          ],
        },
      },
    },
  },
  defaultProps: {
    variant: "contained",
    color: "primary",
    size: "medium",
    orientation: "horizontal",
    buttons: [{ text: "Button 1" }, { text: "Button 2" }],
  },
  render: ({ variant, color, size, orientation, buttons }) => {
    return (
      <MuiButtonGroup
        variant={variant}
        color={color}
        size={size}
        orientation={orientation}
      >
        {buttons?.map((btn, idx) => (
          <Button
            key={idx}
            href={btn.href || undefined}
            disabled={Boolean(btn.disabled)}
          >
            {btn.text}
          </Button>
        ))}
      </MuiButtonGroup>
    );
  },
};

export const ButtonGroup = PButtonGroup;
export default PButtonGroup;
