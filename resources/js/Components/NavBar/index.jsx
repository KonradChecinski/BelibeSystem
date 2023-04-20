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
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import React from "react";
import { Delete, Search } from "@mui/icons-material";

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
                    <FormControl
                        sx={{ ml: 1, width: "100%" }}
                        variant="outlined"
                    >
                        <InputLabel htmlFor="outlined-adornment-password">
                            Produkty
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type="text"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    // aria-label="toggle password visibility"
                                    // onClick={handleClickShowPassword}
                                    // onMouseDown={handleMouseDownPassword}
                                    >
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    {/*<TextField*/}
                    {/*    id="outlined-basic1"*/}
                    {/*    label=""*/}
                    {/*    variant="outlined"*/}
                    {/*    endAdornment={*/}
                    {/*        <InputAdornment position="end">*/}
                    {/*            <IconButton*/}
                    {/*                aria-label="toggle password visibility"*/}
                    {/*                // onClick={handleClickShowPassword}*/}
                    {/*                // onMouseDown={handleMouseDownPassword}*/}
                    {/*            >*/}
                    {/*                <Search />*/}
                    {/*            </IconButton>*/}
                    {/*        </InputAdornment>*/}
                    {/*    }*/}
                    {/*/>*/}
                </Grid>
                <Grid item xs={2}>
                    <FormControl
                        sx={{ ml: 1, width: "100%" }}
                        variant="outlined"
                    >
                        <InputLabel htmlFor="outlined-adornment-password">
                            Produkty
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type="text"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    // aria-label="toggle password visibility"
                                    // onClick={handleClickShowPassword}
                                    // onMouseDown={handleMouseDownPassword}
                                    >
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
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
