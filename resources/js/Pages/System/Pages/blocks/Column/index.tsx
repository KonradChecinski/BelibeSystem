import React from "react";
import {Box, Grid} from "@mui/material";

const columnOptions = [
    {label: "1 kolumna", value: "1"},
    {label: "2 kolumny", value: "2"},
    {label: "3 kolumny", value: "3"},
    {label: "4 kolumny", value: "4"},
];


export type ColumnProps = {
    size: string;
};

export const Column = {
    fields: {
        column: {
            type: "select",
            options: columnOptions,
        },
    },
    defaultProps: {
        column: "4",
    },
    label: "Kolumny",
    render: ({column}) => {
        return (
            <Box sx={{width: 1}}>
                <Grid container spacing={3}>
                    <Grid size="grow">
                        cos
                    </Grid>
                    <Grid size={6}>
                        cos2
                    </Grid>
                    <Grid size="grow">
                        cos3
                    </Grid>
                </Grid>
            </Box>

        );
    },
};
