import { Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Box, Card, Divider, Icon, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import React from "react";
import NavLink from "@/Components/NavLink";
import MenuMainLink from "@/Components/Menu/MenuMainLink";
import SubMenuLink from "@/Components/Menu/SubMenuLink";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TransitionGroup } from "react-transition-group";

export default function Menu({ menu, showContent }) {
    const theme = useTheme();
    const smBreakpointUp = useMediaQuery(theme.breakpoints.up("md"));
    return (
        <Card
            sx={{
                height: 1,
                py: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center"
            }}
        >
            <Link href="/">
                <ApplicationLogo className="block h-auto w-2/3 mx-auto fill-current text-gray-800 dark:text-gray-200" />
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
                <MenuMainLink
                    href={route("system.dashboard")}
                    active={route().current("system.dashboard")}
                    showContent={smBreakpointUp || showContent}
                    text={"Dashboard"}
                />
                <MenuMainLink
                    href={route("system.products.models")}
                    active={route().current("system.products.models")}
                    showContent={smBreakpointUp || showContent}
                    text={"Produkty"}
                />
                <MenuMainLink
                    href={route("system.settings")}
                    active={route().current("system.settings")}
                    showContent={smBreakpointUp || showContent}
                    text={"Ustawienia"}
                >
                    <SubMenuLink
                        href={route("system.settings.main")}
                        active={route().current("system.settings.main")}
                        text={"Główne"}
                    />
                    <SubMenuLink
                        href={route("system.settings.users")}
                        active={route().current("system.settings.users")}
                        text={"Użytkownicy"}
                    />
                </MenuMainLink>
            </Box>
        </Card>
    );
}
