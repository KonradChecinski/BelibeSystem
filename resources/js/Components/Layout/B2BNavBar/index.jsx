import {
    Card,
    Grid,
    IconButton,
    Tooltip,
    Typography, Badge, Avatar
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {
    Search, Event, ShoppingCart, Favorite, Person
} from "@mui/icons-material";
import {router} from "@inertiajs/react";
import Countdown from 'react-countdown';
import B2bSearchModelComponent from "@/Components/Layout/B2BNavBar/SearchComponent/B2bSearchModelComponent";
import B2bUserAvatarMenu from "@/Components/Layout/B2BNavBar/B2bUserAvatar/Menu";

export default function B2BNavBar({auth, clientId, cart, user, accountManager}) {
    const [anchorElUserAvatar, setAnchorElUserAvatar] = useState(null);
    const openUserAvatar = Boolean(anchorElUserAvatar);

    const [cartModel, setCartModel] = useState(cart);
    const handleClickUserAvatar = (event) => {
        setAnchorElUserAvatar(event.currentTarget);
    };
    const handleCloseUserAvatar = () => {
        setAnchorElUserAvatar(null);
    };

    Echo.private("cart.summary." + clientId).listen("CartSummaryUpdated", (e) => {
        setCartModel(e.cartSummary);
    });

    useEffect(() => {
        setCartModel(cart);
    }, [cart]);

    return (
        <>
            <Card
                elevation={1}
                className="p-2"
                sx={{
                    display: "flex"
                }}
            >
                <Grid
                    container
                    spacing={1}
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    {/*<Grid item xs={4} md={2}>*/}
                    {/*    <FormControl*/}
                    {/*        sx={{ml: 1, width: "100%"}}*/}
                    {/*        variant="outlined"*/}
                    {/*    >*/}
                    {/*        <InputLabel htmlFor="outlined-adornment-models">*/}
                    {/*            Model*/}
                    {/*        </InputLabel>*/}
                    {/*        <OutlinedInput*/}
                    {/*            id="outlined-adornment-models"*/}
                    {/*            type="text"*/}
                    {/*            endAdornment={*/}
                    {/*                <InputAdornment position="end">*/}
                    {/*                    <IconButton*/}
                    {/*                        // aria-label="toggle password visibility"*/}
                    {/*                        // onClick={handleClickShowPassword}*/}
                    {/*                        // onMouseDown={handleMouseDownPassword}*/}
                    {/*                    >*/}
                    {/*                        <Search/>*/}
                    {/*                    </IconButton>*/}
                    {/*                </InputAdornment>*/}
                    {/*            }*/}
                    {/*            label="Model"*/}
                    {/*        />*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}
                    <Grid item xs={6} md={4}>
                        <B2bSearchModelComponent searchRoute={route("b2b.model.search")}
                                                 label={"Model"}/>

                    </Grid>
                    {/*<Grid item xs={4} md={2}>*/}
                    {/*    <FormControl*/}
                    {/*        sx={{ml: 1, width: "100%"}}*/}
                    {/*        variant="outlined"*/}
                    {/*    >*/}
                    {/*        <InputLabel htmlFor="outlined-adornment-password">*/}
                    {/*            Firma*/}
                    {/*        </InputLabel>*/}
                    {/*        <OutlinedInput*/}
                    {/*            id="outlined-adornment-password"*/}
                    {/*            type="text"*/}
                    {/*            endAdornment={*/}
                    {/*                <InputAdornment position="end">*/}
                    {/*                    <IconButton*/}
                    {/*                        // aria-label="toggle password visibility"*/}
                    {/*                        // onClick={handleClickShowPassword}*/}
                    {/*                        // onMouseDown={handleMouseDownPassword}*/}
                    {/*                    >*/}
                    {/*                        <Search/>*/}
                    {/*                    </IconButton>*/}
                    {/*                </InputAdornment>*/}
                    {/*            }*/}
                    {/*            label="Firma"*/}
                    {/*        />*/}
                    {/*    </FormControl>*/}
                    {/*</Grid>*/}
                    <Grid
                        item
                        xs={6}
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
                                    position: "relative"
                                }}
                            >
                                <Countdown date={Date.now() + 7200000}

                                           onComplete={() => {
                                               router.post(route("logout"))
                                               // router.visit(route("logout"), {method:"post"})
                                           }}
                                           renderer={({hours, minutes, seconds}) => {
                                               return (

                                                   <Tooltip title="Czas do wygaśnięcia sesji" arrow>
                                                       <Typography variant="h6" gutterBottom>
                                                           {hours.toLocaleString(undefined, {minimumIntegerDigits: 2})}
                                                           :
                                                           {minutes.toLocaleString(undefined, {minimumIntegerDigits: 2})}
                                                           :
                                                           {seconds.toLocaleString(undefined, {minimumIntegerDigits: 2})}
                                                       </Typography>
                                                   </Tooltip>

                                               );
                                           }
                                           }/>

                                <Tooltip title="Show events in system">
                                    <IconButton size={"large"}
                                                onClick={() => {
                                                    router.visit(route("telescope"));
                                                }}>
                                        <Event sx={{fontSize: 25}}/>
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={"Zobacz ulubione"}>
                                    <IconButton size={"large"}
                                                onClick={() => {
                                                    router.visit(route("b2b.favorites"));
                                                }}>
                                        <Favorite sx={{fontSize: 25}}/>
                                    </IconButton>
                                </Tooltip>


                                <Tooltip title={"Zobacz koszyk"}>
                                    <Badge
                                        color="secondary"
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
                                            color="secondary"
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


                                                <ShoppingCart sx={{fontSize: 25}}/>
                                            </IconButton>
                                        </Badge>
                                    </Badge>


                                </Tooltip>

                                {/*<Tooltip title="Delete">*/}
                                {/*    <IconButton>*/}
                                {/*        <Badge badgeContent={4} color="primary">*/}
                                {/*            <Delete sx={{ fontSize: 25 }} />*/}
                                {/*        </Badge>*/}
                                {/*    </IconButton>*/}
                                {/*</Tooltip>*/}

                                {/*<Tooltip title="Delete">*/}
                                {/*    <IconButton>*/}
                                {/*        <Badge badgeContent={4} color="primary">*/}
                                {/*            <Delete sx={{ fontSize: 25 }} />*/}
                                {/*        </Badge>*/}
                                {/*    </IconButton>*/}
                                {/*</Tooltip>*/}

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
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>

            <B2bUserAvatarMenu
                anchorEl={anchorElUserAvatar}
                open={openUserAvatar}
                onClose={handleCloseUserAvatar}
                accountManager={accountManager}
            />
        </>
    );
}

