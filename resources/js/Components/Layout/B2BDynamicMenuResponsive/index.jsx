import {Box, Button, Card, Divider, Grid, Typography,} from "@mui/material";
import React, {Fragment, useEffect, useState} from "react";
import {Link} from "@inertiajs/react";

export default function B2BDynamicMenuResponsive({auth, menu}) {
    return (
        <Grid
            container
            spacing={1}
            justifyContent="flex-start"
            alignItems="center"
        >
            {menu.map((link, id) => (
                    <Fragment key={link.url}>
                        <Grid item xs={12} md={2} sx={{margin: 0,}}>
                            <Button
                                component={Link}
                                href={link.url}
                                sx={{
                                    width: 1,
                                    textTransform: 'none',
                                    justifyContent: "flex-start",
                                    bgcolor: window.location.href === link.url ? "#1967d225" : "",
                                    pl: 1
                                }}
                            >
                                <Typography variant="body1">
                                    {link.name}
                                </Typography>
                            </Button>

                        </Grid>


                    </Fragment>
                )
            )}


        </Grid>
    );
}

