import {Link} from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {Box, Card, Divider} from "@mui/material";
import React from "react";
import MainMenuLink from "@/Components/Menu/MenuMainLink";
import SubMenuLink from "@/Components/Menu/SubMenuLink";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useLaravelReactI18n} from "laravel-react-i18n";

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
            <Link href="/">
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
                />
                {auth.permissions.includes("showModel") ?
                    <MainMenuLink
                        href={route("system.products.models")}
                        active={route().current("system.products.models") || route().current("system.products.model.edit") || route().current("system.products.model")}
                        showContent={smBreakpointUp || showContent}
                        text={"Produkty"}
                    /> : ""}
                {auth.permissions.includes("showSetting") ?
                    <MainMenuLink
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
                            {auth.permissions.includes("showRole") ?
                                <SubMenuLink
                                    href={route("system.settings.sizes")}
                                    active={route().current("system.settings.sizes")}
                                    text={"Rozmiary"}
                                />
                                : ""}
                        </SubMenuLink>
                    </MainMenuLink>
                    : ""}
            </Box>
        </Card>
    );
}
