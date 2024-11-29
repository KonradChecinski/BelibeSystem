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
            {menu.map((link, id) => {
                    const linkUrl = route(link.route, link.parameters)


                    return (
                        <Fragment key={route(link.route, link.parameters)}>
                            <Grid item xs={12} md={2} sx={{margin: 0,}}>
                                <Button
                                    component={Link}
                                    href={linkUrl}
                                    sx={{
                                        width: 1,
                                        textTransform: 'none',
                                        justifyContent: "flex-start",
                                        pl: 1,

                                        bgcolor: window.location.href === linkUrl ? "#1967d2" : "",
                                        "&:hover": {
                                            bgcolor: "#1967d2bb",
                                            color: "menuText.main"
                                        },
                                    }}
                                >
                                    <Typography variant="body1" color={"menuText.main"}>
                                        {link.name}
                                    </Typography>
                                </Button>

                            </Grid>


                        </Fragment>
                    )
                }
            )}


        </Grid>
    );
}

