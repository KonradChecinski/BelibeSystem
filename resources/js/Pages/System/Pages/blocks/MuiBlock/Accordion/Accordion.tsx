import React from "react";
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import type { ComponentConfig } from "@puckeditor/core";
import { DropZone } from "@puckeditor/core";

export type AccordionProps = {
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
  defaultExpanded: boolean;
  disableGutters: boolean;
  body?: string;
};

export type PAccordionProps = AccordionProps;

const ExpandIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: "block" }}
  >
    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
  </svg>
);

export const PAccordion: ComponentConfig<AccordionProps> = {
  label: "Accordion",
  fields: {
    text: {
      label: "Summary / Title",
      type: "text",
    },
    variant: {
      type: "select",
      label: "Title Variant",
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
      label: "Title Align",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
        { value: "justify", label: "Justify" },
        { value: "inherit", label: "Inherit" },
      ],
    },
    defaultExpanded: {
      label: "Default State",
      type: "radio",
      options: [
        { value: true, label: "Expanded" },
        { value: false, label: "Collapsed" },
      ],
    },
    disableGutters: {
      label: "Gutters",
      type: "radio",
      options: [
        { value: true, label: "No Gutters" },
        { value: false, label: "Gutters" },
      ],
    },
    body: {
      label: "Body Text (optional)",
      type: "textarea",
    },
  },
  defaultProps: {
    text: "Accordion Title",
    variant: "body1",
    align: "inherit",
    defaultExpanded: false,
    disableGutters: false,
    body: "",
  },
  render: ({
    text,
    variant,
    align,
    defaultExpanded,
    disableGutters,
    body,
    id,
  }: AccordionProps & { id?: string }) => {
    return (
      <MuiAccordion
        defaultExpanded={defaultExpanded}
        disableGutters={disableGutters}
      >
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant={variant} align={align}>
            {text}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {body ? (
            <Typography variant="body2" sx={{ mb: 1 }}>
              {body}
            </Typography>
          ) : null}
          <DropZone zone={id ? `zone-${id}` : "accordion-content"} />
        </AccordionDetails>
      </MuiAccordion>
    );
  },
};

export const Accordion = PAccordion;
export default PAccordion;
