import React from "react";

import {Section} from "../../components/Section";
import {Typography} from "@mui/material";

export type TextProps = {
    align: "left" | "center" | "right";
    text?: string;
    padding?: string;
    size?: "s" | "m";
    color: "default" | "muted";
    maxWidth?: string;
};

export const Text = {
    fields: {
        text: {
            type: "textarea",
            label: "Tekst",
        },
        variant: {
            type: "select",
            label: "Wariant",
            options: [
                {label: "H1", value: "h1"},
                {label: "H2", value: "h2"},
                {label: "H3", value: "h3"},
                {label: "H4", value: "h4"},
                {label: "H5", value: "h5"},
                {label: "H6", value: "h6"},
                {label: "subtitle1", value: "subtitle1"},
                {label: "subtitle2", value: "subtitle1"},
                {label: "body1", value: "body1"},
                {label: "body2", value: "body2"},
            ],
        },
        align: {
            type: "radio",
            label: "Wyrównanie",
            options: [
                {label: "Do lewej", value: "left"},
                {label: "Do środka", value: "center"},
                {label: "Do prawej", value: "right"},
            ],
        },
        color: {
            type: "radio",
            label: "Kolor",
            options: [
                {label: "Default", value: "default"},
                {label: "Muted", value: "muted"},
            ],
        },
        paddingX: {
            type: "number",
            label: "Odstęp w poziomie",
        },
        paddingY: {
            type: "number",
            label: "Odstęp w pionie",
        },
    },
    defaultProps: {
        text: "Przykładowy tekst",
        variant: "body1",
        align: "left",

        paddingX: "24",
        paddingY: "24",
        color: "default",
    },
    label: "Tekst",
    render: ({text, variant, align, paddingX, paddingY}) => {
        return (
            // <Section>
            <Typography
                variant={variant}
                align={align}
                sx={{
                    color: "",
                    px: paddingX + "px",
                    py: paddingY + "px",
                }}
            >
                {text}
            </Typography>
            // </Section>
        );
    },
};
