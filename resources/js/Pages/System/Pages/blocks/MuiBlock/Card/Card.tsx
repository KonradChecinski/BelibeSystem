import React from "react";
import { Card as MuiCard, CardHeader, CardContent } from "@mui/material";
import type { ComponentConfig } from "@puckeditor/core";
import { DropZone } from "@puckeditor/core";

export type CardProps = {
  title: string;
  subheader?: string;
  raised?: boolean;
};

export type PCardProps = CardProps;

export const PCard: ComponentConfig<CardProps> = {
  label: "Card",
  fields: {
    title: {
      label: "Title",
      type: "text",
    },
    subheader: {
      label: "Subheader",
      type: "text",
    },
    raised: {
      label: "Raised",
      type: "select",
      options: [
        { value: true, label: "True" },
        { value: false, label: "False" },
      ],
    },
  },
  defaultProps: {
    title: "Card Title",
    subheader: "",
    raised: false,
  },
  render: ({ title, subheader, raised, id }: CardProps & { id?: string }) => {
    return (
      <MuiCard raised={Boolean(raised)}>
        {(title || subheader) && (
          <CardHeader
            title={title || undefined}
            subheader={subheader || undefined}
          />
        )}
        <CardContent>
          <DropZone zone={id ? `zone-${id}` : "card-content"} />
        </CardContent>
      </MuiCard>
    );
  },
};

export const Card = PCard;
export default PCard;
