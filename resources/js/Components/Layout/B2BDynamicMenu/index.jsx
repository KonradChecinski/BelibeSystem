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
                    {Array(6).fill(0).map((c, id) => {


                        return (
                            <Fragment key={id}>
                                <Grid item xs={3} md={2} sx={{margin: 0}}>
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
                                            <Typography variant="h6" component="h5" textAlign={"center"}>
                                                Strona główna
                                            </Typography>
                                        </Box>
                                    </Link>
                                </Grid>

                                {id !== 5 && (<Divider orientation="vertical" flexItem variant="middle"
                                                       sx={{mr: "-1px", mt: 2}}/>)}

                            </Fragment>
                        )
                    })}


                </Grid>
            </Card>
        </>
    );
}

