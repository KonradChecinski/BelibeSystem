import { Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {
    Badge,
    Card,
    Divider,
    Grid,
    IconButton,
    TextField,
    Tooltip,
} from "@mui/material";
import React from "react";
import { Delete } from "@mui/icons-material";

export default function Navbar({ navbar }) {
    return (
        <Card
            className="p-2"
            sx={{
                position: "fixed",
                top: "1%",
                right: ".5%",
                zIndex: 1000,
                height: "72px",
                width: "82.5%",
            }}
        >
            <Grid
                container
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
            >
                <Grid item xs={2}>
                    <TextField
                        id="outlined-basic1"
                        label="Produkty"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        id="outlined-basic2"
                        label="Outlined"
                        variant="outlined"
                    />
                </Grid>
                <Grid
                    item
                    xs={8}
                    justifyContent="flex-end"
                    alignItems="flex-end"
                >
                    <Grid
                        container
                        spacing={1}
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                        <Grid item xs={1}>
                            <Tooltip title="Delete">
                                <IconButton>
                                    <Badge badgeContent={4} color="primary">
                                        <Delete />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}
