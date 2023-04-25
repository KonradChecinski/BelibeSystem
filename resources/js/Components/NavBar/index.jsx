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
    Avatar,
    Menu,
    MenuItem,
} from "@mui/material";
import React from "react";
import { Delete, Search } from "@mui/icons-material";

export default function Navbar({ navbar }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                display: "flex",
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
                        <Grid item xs={1}>
                            <Avatar
                                alt="Remy Sharp"
                                src="/storage/favicons/B.png"
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleClick}
                            >
                                NS
                            </Avatar>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Logout
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}
