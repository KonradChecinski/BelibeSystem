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
    Menu,
    MenuItem,
    Chip,
    ListItemIcon,
    Avatar,
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

                        <Grid
                            item
                            xs={1}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                            }}
                        >
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleClick}
                                    sx={{ ml: 2 }}
                                    aria-controls={
                                        open ? "account-menu" : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                >
                                    <UserAvatar auth={auth} />
                                </IconButton>
                            </Tooltip>

                            {/*<ClickAwayListener*/}
                            {/*    mouseEvent="onMouseDown"*/}
                            {/*    touchEvent="onTouchStart"*/}
                            {/*    onClickAway={handleClose}*/}
                            {/*>*/}
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                hideBackdrop={true}
                                disableScrollLock
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: "visible",
                                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                        mt: 1.5,
                                        "& .MuiAvatar-root": {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        "&:before": {
                                            content: '""',
                                            display: "block",
                                            position: "absolute",
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: "background.paper",
                                            transform:
                                                "translateY(-50%) rotate(45deg)",
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{
                                    horizontal: "right",
                                    vertical: "top",
                                }}
                                anchorOrigin={{
                                    horizontal: "right",
                                    vertical: "bottom",
                                }}
                            >
                                <Link href={route("profile.edit")}>
                                    <MenuItem onClick={handleClose}>
                                        <Avatar /> Profile
                                    </MenuItem>
                                </Link>

                                <Divider />
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Logout
                                    </Link>
                                </MenuItem>
                            </Menu>
                            {/*</ClickAwayListener>*/}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}
