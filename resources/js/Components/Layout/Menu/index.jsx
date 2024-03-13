import {Link} from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {Box, Card, Divider} from "@mui/material";
import React from "react";
import MainMenuLink from "@/Components/Layout/Menu/MenuMainLink";
import SubMenuLink from "@/Components/Layout/Menu/SubMenuLink";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Category, Dashboard, Group, Settings} from '@mui/icons-material';

export default function Menu({showContent, auth}) {
    const theme = useTheme();
    const smBreakpointUp = useMediaQuery(theme.breakpoints.up("md"));
    const {t} = useLaravelReactI18n();

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
            <Link href="/public">
                <ApplicationLogo className="block h-auto w-2/3 mx-auto fill-current text-gray-800 dark:text-gray-200"/>
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
                <MainMenuLink
                    href={route("system.dashboard")}
                    active={route().current("system.dashboard")}
                    showContent={smBreakpointUp || showContent}
                    text={t("Dashboard")}
                    menuIcon={Dashboard}
                />
                {auth.permissions.includes("showModel") ?
                    <MainMenuLink
                        href={route("system.products.models")}
                        active={route().current("system.products.models") || route().current("system.products.model.edit") || route().current("system.products.model")}
                        showContent={smBreakpointUp || showContent}
                        text={"Produkty"}
                        menuIcon={Category}
                    /> : ""}
                {auth.permissions.includes("showClient") ?
                    <MainMenuLink
                        href={route("system.clients")}
                        active={route().current("system.clients") || route().current("system.clients.edit") || route().current("system.clients")}
                        showContent={smBreakpointUp || showContent}
                        text={"Klienci"}
                        menuIcon={Group}
                    /> : ""}
                {auth.permissions.includes("showSetting") ?
                    <MainMenuLink
                        href={route("system.settings")}
                        active={route().current("system.settings")}
                        showContent={smBreakpointUp || showContent}
                        text={"Ustawienia"}
                        menuIcon={Settings}
                    >
                        <SubMenuLink
                            href={route("system.settings.main")}
                            active={route().current("system.settings.main")}
                            text={"Główne"}
                        />
                        <SubMenuLink
                            href={route("system.settings.users")}
                            active={false}
                            text={"Użytkownicy i uprawnienia"}
                        >
                            {auth.permissions.includes("showRole") ?
                                <React.Fragment>
                                    <SubMenuLink
                                        href={route("system.settings.users")}
                                        active={route().current("system.settings.users")}
                                        text={"Lista użytkowników"}
                                    />

                                    <SubMenuLink
                                        href={route("system.settings.roles")}
                                        active={route().current("system.settings.roles")}
                                        text={"Role systemowe"}
                                    />
                                </React.Fragment>
                                : ""}
                        </SubMenuLink>
                        <SubMenuLink
                            href={route("system.settings.sizes")}
                            active={false}
                            text={"Słowniki"}
                        >

                            <SubMenuLink
                                href={route("system.settings.sizes")}
                                active={route().current("system.settings.sizes")}
                                text={"Rozmiary"}
                            />

                            <SubMenuLink
                                href={route("system.settings.unit")}
                                active={route().current("system.settings.unit")}
                                text={"Jednostki"}
                            />

                            <SubMenuLink
                                href={route("system.settings.group")}
                                active={route().current("system.settings.group")}
                                text={"Grupy"}
                            />

                            <SubMenuLink
                                href={route("system.settings.brand")}
                                active={route().current("system.settings.brand")}
                                text={"Marki"}
                            />

                            <SubMenuLink
                                href={route("system.settings.category")}
                                active={route().current("system.settings.category")}
                                text={"Kategorie"}
                            />

                            <SubMenuLink
                                href={route("system.settings.gs1.brand")}
                                active={route().current("system.settings.gs1.brand")}
                                text={"GS1"}
                            >
                                <SubMenuLink
                                    href={route("system.settings.gs1.brand")}
                                    active={route().current("system.settings.gs1.brand")}
                                    text={"Marki"}
                                />

                                <SubMenuLink
                                    href={route("system.settings.gs1.gpc")}
                                    active={route().current("system.settings.gs1.gpc")}
                                    text={"Klasyfikacja GPC"}
                                />
                            </SubMenuLink>

                            <SubMenuLink
                                href={route("system.settings.b2c.category")}
                                active={route().current("system.settings.b2c.category")}
                                text={"B2C"}
                            >
                                <SubMenuLink
                                    href={route("system.settings.b2c.category")}
                                    active={route().current("system.settings.b2c.category")}
                                    text={"Kategorie"}
                                />
                                <SubMenuLink
                                    href={route("system.settings.b2c.color")}
                                    active={route().current("system.settings.b2c.color")}
                                    text={"Kolory"}
                                />
                            </SubMenuLink>

                        </SubMenuLink>
                    </MainMenuLink>
                    : ""}
            </Box>
        </Card>
    );
}
