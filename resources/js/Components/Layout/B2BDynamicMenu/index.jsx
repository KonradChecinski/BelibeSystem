import {Box, Card, Divider, Grid, Typography,} from "@mui/material";
import {Fragment, useEffect, useState} from "react";
import {Link} from "@inertiajs/react";

export default function B2BDynamicMenu({auth, menu}) {
    return (
        <>
            <Card
                elevation={1}
                className="p-2"
                sx={{
                    display: "flex",
                    mt: 1,
                }}
            >
                <Grid
                    container
                    spacing={1}
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    {menu.map((link, id) => {
                            const linkUrl = route(link.route, link.parameters)

                            return (
                                <Fragment key={link.url}>
                                    <Grid item xs={12} md={2} sx={{margin: 0, px: 1}}>
                                        <Link href={linkUrl}>
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
                                                    bgcolor: window.location.href === linkUrl ? "#1967d2" : "",
                                                    color: window.location.href === linkUrl ? "menuText.main" : "",
                                                    "&:hover": {
                                                        bgcolor: "#1967d2bb",
                                                        color: "menuText.main"
                                                    },
                                                }}>
                                                <Typography variant="h6" component="h5" textAlign={"center"}>
                                                    {link.name}
                                                </Typography>
                                            </Box>
                                        </Link>
                                    </Grid>

                                    {id !== 5 && (<Divider orientation="vertical" flexItem variant="middle"
                                                           sx={{mr: "-1px", mt: 2}}/>)}

                                </Fragment>
                            )
                        }
                    )}


                </Grid>
            </Card>
        </>
    );
}

