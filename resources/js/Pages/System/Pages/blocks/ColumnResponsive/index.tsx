import React from 'react';
import {DropZone} from '@measured/puck';
import {Box, Grid, Typography} from '@mui/material';

export type ColumnResponsiveProps = {
    gap: number;
    columns: {
        md?: number;
        sm?: number;
        xs?: number;
    }[];
};

export const ColumnResponsive = {
    label: 'Columns',
    fields: {
        gap: {
            type: 'number',
            label: 'Spacing',
            min: 0
        },
        columns: {
            type: 'array',
            getItemSummary: (col, id = -1) => (
                <Box>
                    <Typography>Kolumna {id + 1}</Typography>
                    <Typography> MD={col.md}, SM={col.sm}, XS={col.xs}</Typography>
                </Box>
            ),
            arrayFields: {
                md: {
                    label: 'MD w górę (suma wszystkich kolumn w MD ma dać 12)',
                    type: 'number',
                    min: 1,
                    max: 12
                },
                sm: {
                    label: 'SM w górę (suma wszystkich kolumn w SM ma dać 12)',
                    type: 'number',
                    min: 1,
                    max: 12
                },
                xs: {
                    label: 'XS w górę (suma wszystkich kolumn w XS ma dać 12)',
                    type: 'number',
                    min: 1,
                    max: 12
                }
            }
        }
    },
    defaultProps: {
        gap: 2,
        columns: [{md: 6, sm: 6, xs: 6}, {md: 6, sm: 6, xs: 6}]
    },
    render: ({columns, spacing}) => {
        return (
            <Grid
                container
                spacing={spacing}
                // style={{
                //     gridTemplateColumns: distribution === 'manual' ? 'repeat(12, 1fr)' : `repeat(${columns.length}, 1fr)`
                // }}
            >
                {columns.map(({gap, md, sm, xs}, idx) => (
                    <Grid
                        item
                        key={idx}
                        xs={xs}
                        sm={sm}
                        md={md}
                        // xs={
                        //     distribution === 'manual' && span
                        //         ? Math.max(Math.min(span, 12), 1) // If manual, set the span between 1 and 12
                        //         : true // If auto, let MUI automatically size the columns
                        // }
                    >
                        <DropZone zone={`column-${idx}`} disallow={['Columns']}/>
                    </Grid>
                ))}
            </Grid>
        );
    }
};
