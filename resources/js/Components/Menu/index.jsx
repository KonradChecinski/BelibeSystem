import { Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Box, Card, Divider, Icon, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import React from "react";
import NavLink from "@/Components/NavLink";
import MenuMainLink from "@/Components/Menu/MenuMainLink";

export default function Menu({ menu }) {
    return (
        <Card
            sx={{
                height: 1,
                py: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
            }}
        >
            <Link href="/">
                <ApplicationLogo className="block h-auto w-2/3 mx-auto fill-current text-gray-800 dark:text-gray-200" />
            </Link>
            <Divider
                component="div"
                sx={{
                    background:
                        "linear-gradient(90deg, rgba(31,40,62,1) 0%, rgba(255,255,255,0.5) 50%, rgba(31,40,62,1) 100%)",
                    height: "2px",
                    width: "80%",
                    mx: "auto",
                    my: 1,
                }}
            />
            <MenuMainLink
                href={route("system.dashboard2")}
                active={route().current("system.dashboard2")}
                text={"Dashboard2"}
            />
            <MenuMainLink
                href={route("system.dashboard3")}
                active={route().current("system.dashboard3")}
                text={"Dashboard3"}
            />
            <MenuMainLink
            // href={route("system.dashboard3")}
            // active={route().current("system.dashboard3")}
            />
            <MenuMainLink
            // href={route("system.dashboard3")}
            // active={route().current("system.dashboard3")}
            />
            <MenuMainLink
            // href={route("system.dashboard3")}
            // active={route().current("system.dashboard3")}
            />
            <MenuMainLink
            // href={route("system.dashboard3")}
            // active={route().current("system.dashboard3")}
            />
            <MenuMainLink
            // href={route("system.dashboard3")}
            // active={route().current("system.dashboard3")}
            />
            <Box
                sx={{
                    my: 2,
                    width: 1,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Link
                    href={route("system.dashboard2")}
                    active={route().current("system.dashboard2")}
                >
                    <Typography
                        align="center"
                        variant="h5"
                        sx={{
                            width: "fit-content",
                            position: "relative",
                            "&::after": {
                                content: "''",
                                position: "absolute",
                                width: 1,
                                transform: "scaleX(0)",
                                height: "2px",
                                bottom: 0,
                                left: 0,
                                background: "#0087ca",
                                transformOrigin: "bottom right",
                                transition: "transform 0.25s ease-out",
                            },
                            "&:hover::after": {
                                transform: "scaleX(1)",
                                transformOrigin: "bottom left",
                            },
                        }}
                    >
                        Dashboard2
                    </Typography>
                </Link>
            </Box>

            {/*<NavLink*/}
            {/*    href={route("system.dashboard2")}*/}
            {/*    active={route().current("system.dashboard2")}*/}
            {/*>*/}
            {/*    /!*{...props}*!/*/}
            {/*    /!*    className={*!/*/}
            {/*    /!*    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +*!/*/}
            {/*    /!*    (active*!/*/}
            {/*    /!*        ? 'border-indigo-400 dark:border-indigo-600 text-gray-900 dark:text-gray-100 focus:border-indigo-700 '*!/*/}
            {/*    /!*        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ') +*!/*/}
            {/*    /!*    className*!/*/}
            {/*    /!*}*!/*/}
            {/*    Dashboard2*/}
            {/*</NavLink>*/}
            {/*<NavLink*/}
            {/*    href={route("system.dashboard3")}*/}
            {/*    active={route().current("system.dashboard3")}*/}
            {/*>*/}
            {/*    Dashboard3*/}
            {/*</NavLink>*/}
        </Card>
    );
}
