import {

    Card,
    Grid,
    IconButton,
    Tooltip,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
    Typography, TextField, Autocomplete
} from "@mui/material";
import {useState} from "react";
import {
    Search, Event, ShoppingCart, Favorite
} from "@mui/icons-material";
import UserAvatar from "@/Components/Layout/UserAvatar";
import UserAvatarMenu from "@/Components/Layout/UserAvatar/Menu";
import {router} from "@inertiajs/react";
import Countdown from 'react-countdown';
import SearchModelComponent from "@/Components/Layout/NavBar/SearchComponent/SearchModelComponent";
import SearchClientComponent from "@/Components/Layout/NavBar/SearchComponent/SearchClientComponent";
import B2bSearchModelComponent from "@/Components/Layout/B2BNavBar/SearchComponent/B2bSearchModelComponent";

export default function B2BNavBar({auth}) {
    const [anchorElUserAvatar, setAnchorElUserAvatar] = useState(null);
    const openUserAvatar = Boolean(anchorElUserAvatar);
    const handleClickUserAvatar = (event) => {
        setAnchorElUserAvatar(event.currentTarget);
    };
    const handleCloseUserAvatar = () => {
        setAnchorElUserAvatar(null);
    };

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
                                    <IconButton size={"large"}
                                                onClick={() => {
                                                    // router.visit(route("system.cart"));
                                                }}>
                                        <ShoppingCart sx={{fontSize: 25}}/>
                                    </IconButton>
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
                                        <UserAvatar user={auth.user}/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>

            <UserAvatarMenu
                anchorEl={anchorElUserAvatar}
                open={openUserAvatar}
                onClose={handleCloseUserAvatar}
            />
        </>
    );
}

