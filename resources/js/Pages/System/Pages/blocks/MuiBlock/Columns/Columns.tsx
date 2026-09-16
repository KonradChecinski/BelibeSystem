import React from "react";
import { Grid } from "@mui/material";
import type { ComponentConfig } from "@puckeditor/core";
import { DropZone } from "@puckeditor/core";

export type ColumnItem = {
  span?: number;
};

export type ColumnsProps = {
  spacing: number;
  distribution: "auto" | "manual";
  columns: ColumnItem[];
};

export type PColumnsProps = ColumnsProps;

export const PColumns: ComponentConfig<ColumnsProps> = {
  label: "Columns",
  fields: {
    spacing: {
      type: "number",
      label: "Spacing",
      min: 0,
      max: 12,
    },
    distribution: {
      type: "radio",
      label: "Distribution",
      options: [
        { value: "auto", label: "Auto" },
        { value: "manual", label: "Manual" },
      ],
    },
    columns: {
      type: "array",
      label: "Columns",
      getItemSummary: (col, id) => {
        const index = id !== undefined ? id : -1;
        const spanText = col?.span
          ? Math.max(Math.min(col.span, 12), 1)
          : "auto";
        return `Column ${index + 1}, span ${spanText}`;
      },
      arrayFields: {
        span: {
          label: "Span (1-12)",
          type: "number",
          min: 1,
          max: 12,
        },
      },
    },
  },
  defaultProps: {
    spacing: 2,
    distribution: "auto",
    columns: [{}, {}],
  },
  render: ({ columns, distribution, spacing }) => {
    const cols = columns && columns.length > 0 ? columns : [{}, {}];

    return (
      <Grid container spacing={spacing}>
        {cols.map((col, idx) => {
          const xsValue =
            distribution === "manual" && col.span
              ? Math.max(Math.min(col.span, 12), 1)
              : true;

          return (
            <Grid item key={idx} xs={xsValue as any}>
              <DropZone
                zone={`column-${idx}`}
                disallow={["Columns", "PColumns"]}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  },
};

export const Columns = PColumns;
export default PColumns;
