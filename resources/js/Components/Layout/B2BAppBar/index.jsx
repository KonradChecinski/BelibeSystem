import React, {useState} from "react";
import {
    Box,
    IconButton,
    Badge,
    Typography,
    Menu as MuiMenu,
    AppBar as MuiAppBar,
    Toolbar,
    InputBase,
    MenuItem,
    SwipeableDrawer, Tooltip, Avatar,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import {styled, alpha} from "@mui/material/styles";
import B2bSearchModelComponent from "@/Components/Layout/B2BNavBar/SearchComponent/B2bSearchModelComponent";
import {router} from "@inertiajs/react";
import {Person, ShoppingCart} from "@mui/icons-material";
import B2bUserAvatarMenu from "@/Components/Layout/B2BNavBar/B2bUserAvatar/Menu";

const Search = styled("div")(({theme}) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));
export default function B2BAppBar({position, cart, clientId, accountManager, children}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const [cartModel, setCartModel] = useState(cart);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


    const [anchorElUserAvatar, setAnchorElUserAvatar] = useState(null);
    const openUserAvatar = Boolean(anchorElUserAvatar);

    const handleClickUserAvatar = (event) => {
        setAnchorElUserAvatar(event.currentTarget);
    };
    const handleCloseUserAvatar = () => {
        setAnchorElUserAvatar(null);
    };

    Echo.private("cart.summary." + clientId).listen("CartSummaryUpdated", (e) => {
        setCartModel(e.cartSummary);
    });

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <MuiMenu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                >
                    <Badge badgeContent={4} color="error">
                        <MailIcon/>
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </MuiMenu>
    );

    return (
        <>
            <MuiAppBar
                color={"secondary"}
                position={position}
                sx={{
                    borderRadius: 1,
                    borderTopRightRadius: 0,
                    borderTopLeftRadius: 0,
                }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{
                            mr: 2,
                        }}
                        onClick={() => setOpenDrawer(!openDrawer)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {/*<Search>*/}
                    {/*    <SearchIconWrapper>*/}
                    {/*        <SearchIcon />*/}
                    {/*    </SearchIconWrapper>*/}
                    {/*    <StyledInputBase*/}
                    {/*        placeholder="Search…"*/}
                    {/*        inputProps={{ "aria-label": "search" }}*/}
                    {/*    />*/}
                    {/*</Search>*/}
                    <Box sx={{my: 1, width: 1}}>
                        <B2bSearchModelComponent searchRoute={route("b2b.model.search")}
                                                 label={"Model"}/>
                    </Box>

                    <Box sx={{flexGrow: 1}}/>


                    <Box sx={{display: {xs: "flex", md: "none"}}}>

                        <Tooltip title={"Zobacz koszyk"}>
                            <Badge
                                color="primary"
                                badgeContent={
                                    <Tooltip title={"Ilość produktów w koszyku"} placement={"left"}>
                                        <span>{cartModel?.products}</span>
                                    </Tooltip>
                                }
                                overlap="circular"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}>
                                <Badge
                                    color="primary"
                                    badgeContent={
                                        <Tooltip title={"Ilość modeli w koszyku"} placement={"left"}>
                                            <span>{cartModel?.models}</span>
                                        </Tooltip>
                                    }
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}>
                                    <IconButton size={"large"}
                                                onClick={() => {
                                                    router.visit(route("b2b.cart"));
                                                }}>


                                        <ShoppingCart sx={{fontSize: 25, color: "field.background"}}/>
                                    </IconButton>
                                </Badge>
                            </Badge>
                        </Tooltip>
                    </Box>


                    {/*<Box sx={{display: {xs: "flex", md: "none"}}}>*/}
                    {/*    <IconButton*/}
                    {/*        size="large"*/}
                    {/*        aria-label="show more"*/}
                    {/*        aria-controls={mobileMenuId}*/}
                    {/*        aria-haspopup="true"*/}
                    {/*        onClick={handleMobileMenuOpen}*/}
                    {/*        color="inherit"*/}
                    {/*    >*/}
                    {/*        <MoreIcon/>*/}
                    {/*    </IconButton>*/}
                    {/*</Box>  */}
                    <Box sx={{display: {xs: "flex", md: "none"}}}>
                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleClickUserAvatar}
                                sx={{ml: 2}}
                                aria-controls={
                                    open ? "account-menu" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={
                                    open ? "true" : undefined
                                }
                            >
                                <Avatar
                                    // src={"/storage/favicons/B.png"}
                                    sx={{
                                        boxShadow: 5,
                                    }}
                                >
                                    <Person fontSize={"large"}/>
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </MuiAppBar>
            <B2bUserAvatarMenu
                anchorEl={anchorElUserAvatar}
                open={openUserAvatar}
                onClose={handleCloseUserAvatar}
                accountManager={accountManager}
            />
            <SwipeableDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onOpen={() => setOpenDrawer(true)}
            >
                <Box
                    sx={{
                        height: 1,
                        borderRadius: 0,
                        bgcolor: "transparent",
                    }}
                >
                    {children}
                </Box>
            </SwipeableDrawer>
        </>
    );
}
