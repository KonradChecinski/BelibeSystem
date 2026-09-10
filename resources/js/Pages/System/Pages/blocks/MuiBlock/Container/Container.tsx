import React from "react";
import { Container as MuiContainer } from "@mui/material";
import type { ComponentConfig } from "@puckeditor/core";
import { DropZone } from "@puckeditor/core";

export type ContainerProps = {
  fixed: boolean;
  maxWidth: "xs" | "sm" | "md" | "lg" | "xl";
};

export type PContainerProps = ContainerProps;

export const PContainer: ComponentConfig<ContainerProps> = {
  label: "Container",
  fields: {
    fixed: {
      type: "radio",
      label: "Layout",
      options: [
        { value: true, label: "Fixed" },
        { value: false, label: "Fluid" },
      ],
    },
    maxWidth: {
      type: "select",
      label: "Max Width",
      options: [
        { value: "xs", label: "Extra Small (xs)" },
        { value: "sm", label: "Small (sm)" },
        { value: "md", label: "Medium (md)" },
        { value: "lg", label: "Large (lg)" },
        { value: "xl", label: "Extra Large (xl)" },
      ],
    },
  },
  defaultProps: {
    maxWidth: "lg",
    fixed: false,
  },
  render: ({ maxWidth, fixed, id }: ContainerProps & { id?: string }) => {
    return (
      <MuiContainer maxWidth={maxWidth} fixed={fixed}>
        <DropZone zone={id ? `zone-${id}` : "container-content"} />
      </MuiContainer>
    );
  },
};

export const Container = PContainer;
export default PContainer;
