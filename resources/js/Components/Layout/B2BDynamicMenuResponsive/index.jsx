import {Box, Card, Divider, Grid, Typography,} from "@mui/material";
import {Fragment, useEffect, useState} from "react";
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
                    <Fragment key={link.id}>
                        <Grid item xs={12} md={2} sx={{margin: 0,}}>
                            <Link href={link.url}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        width: "100%",
                                        cursor: "pointer",
                                        borderRadius: 1,
                                        p: 0.5,
                                        "&:hover": {
                                            backgroundColor: "#1967d225",
                                        },
                                    }}>
                                    <Typography variant="h6" component="h5" textAlign={"center"}>
                                        {link.name}
                                    </Typography>
                                </Box>
                            </Link>
                        </Grid>


                    </Fragment>
                )
            )}


        </Grid>
    );
}

