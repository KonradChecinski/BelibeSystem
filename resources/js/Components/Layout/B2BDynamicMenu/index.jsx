import {Box, Card, Divider, Grid, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
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
                    <Grid item xs={3} md={1} sx={{margin: 0}}>
                        <Link href={route('b2b.main')}>
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
                                        bgcolor: "primary.main",
                                    },
                                }}>
                                <Typography variant="h6" component="h5">
                                    Strona główna
                                </Typography>
                            </Box>
                        </Link>
                    </Grid>

                    <Divider orientation="vertical" flexItem variant="middle" sx={{mr: "-1px", mt: 2}}/>

                    <Grid item xs={3} md={1} sx={{margin: 0}}>
                        <Link href={route('b2b.main')}>
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
                                        bgcolor: "primary.main",
                                    },
                                }}>
                                <Typography variant="h6" component="h5">
                                    Strona główna
                                </Typography>
                            </Box>
                        </Link>
                    </Grid>


                </Grid>
            </Card>
        </>
    );
}

