import {Link, router} from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {Box, Button, Card, Divider, IconButton, Tooltip} from "@mui/material";
import React from "react";
import MainMenuLink from "@/Components/Layout/Menu/MenuMainLink";
import SubMenuLink from "@/Components/Layout/Menu/SubMenuLink";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {ArrowBack, Category, Dashboard, Delete, ExitToApp, Group, QueryStats, Settings} from '@mui/icons-material';
import MenuComponent from "@/Components/Layout/B2BMenu/MenuComponent";

export default function B2BMenu({showContent, auth, accountManager = false, bgImage, categories}) {
    const theme = useTheme();
    const darkMode = theme.palette.mode === "dark";
    const smBreakpointUp = useMediaQuery(theme.breakpoints.up("md"));
    const {t} = useLaravelReactI18n();

    return (
        <Card
            sx={{
                position: "relative",
                height: 1,
                py: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                overflow: "hidden", // Ensure overflow doesn't cause issues
            }}
        >
            {/* Background image and overlay container */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0, // Ensure the container is behind other content
                }}
            >
                {/* Background image */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                {/* Dark overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)', // Adjust the opacity (last value) as needed
                        pointerEvents: 'none', // Allow clicks to pass through the overlay
                    }}
                />
            </Box>

            {/* Content */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: "1", // Place the content above the dark overlay
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%", // Ensure content takes full width
                    height: "100%", // Ensure content takes full height
                }}
            >

                {accountManager && (
                    <Tooltip title="Powrót do systemu" arrow>
                        <IconButton
                            aria-label="return"
                            onClick={() => router.post(route("system.b2b.order.end"))}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 5,
                                color: "menuText.main"
                            }}>
                            <ArrowBack/>
                        </IconButton>
                    </Tooltip>
                )}


                <Link href={route("b2b.main")}>
                    <ApplicationLogo
                        className="block h-auto w-2/3 mx-auto fill-current text-gray-800 dark:text-gray-200"/>
                </Link>
                <Divider
                    component="div"
                    sx={{
                        // background:
                        //     "linear-gradient(90deg, rgba(31,40,62,1) 0%, rgba(255,255,255,0.5) 50%, rgba(31,40,62,1) 100%)",
                        background: theme.palette.gradient.divider,
                        height: "2px",
                        width: "80%",
                        mx: "auto",
                        my: 1
                    }}
                />
                <Box
                    sx={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        height: 1,
                        width: "80%"
                    }}
                >
                    <MenuComponent categories={categories}/>

                </Box>
            </Box>
        </Card>
    );
}
