import { Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {
    Badge,
    Card,
    Grid,
    IconButton,
    Tooltip,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
    ListItemIcon,
    Avatar,
    Typography,
} from "@mui/material";
import { ClickAwayListener } from "@mui/base";
import { useState } from "react";
import {
    Delete,
    Search,
    ArrowDropDown,
    PersonAdd,
    Settings,
    Logout,
} from "@mui/icons-material";
import UserAvatar from "@/Components/UserAvatar";
import UserAvatarMenu from "@/Components/UserAvatar/Menu";

export default function Navbar({ auth }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Card
                className="p-2"
                sx={{
                    display: "flex",
                }}
            >
                <Grid
                    container
                    spacing={1}
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Grid item xs={4} md={2}>
                        <FormControl
                            sx={{ ml: 1, width: "100%" }}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password">
                                Produkt
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
                    <Grid item xs={4} md={2}>
                        <FormControl
                            sx={{ ml: 1, width: "100%" }}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password">
                                Firma
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
                        xs={4}
                        md={8}
                        justifyContent="flex-end"
                        alignItems="flex-end"
                    >
                        <Grid
                            container
                            spacing={1}
                            justifyContent="flex-end"
                            alignItems="flex-end"
                        >
                            <Grid
                                item
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    position: "relative",
                                }}
                            >
                                <Tooltip title="Delete">
                                    <IconButton>
                                        <Badge badgeContent={4} color="primary">
                                            <Delete sx={{ fontSize: 30 }} />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete">
                                    <IconButton>
                                        <Badge badgeContent={4} color="primary">
                                            <Delete sx={{ fontSize: 30 }} />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete">
                                    <IconButton>
                                        <Badge badgeContent={4} color="primary">
                                            <Delete sx={{ fontSize: 30 }} />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Account settings">
                                    <IconButton
                                        onClick={handleClick}
                                        sx={{ ml: 2 }}
                                        aria-controls={
                                            open ? "account-menu" : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                            open ? "true" : undefined
                                        }
                                    >
                                        <UserAvatar auth={auth} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>

            <UserAvatarMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            />
        </>
    );
}
