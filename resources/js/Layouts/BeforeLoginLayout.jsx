import ApplicationLogo from "@/Components/ApplicationLogo";
import {Link} from "@inertiajs/react";
import Theme from "@/Theme/Theme";
import {Box} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useEffect, useState} from "react";

export default function BeforeLoginLayout({background, children}) {
    let theme = useTheme();
    const isLightMode = useMediaQuery("(prefers-color-scheme: light)");
    const smBreakpointUp = useMediaQuery(theme.breakpoints.up("sm"));

    return (
        <Theme>
            <Box sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                pt: 0,
                backgroundImage: `url('${background}')`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}>
                <Box
                    sx={{
                        width: 1,
                        minHeight: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: isLightMode ? "rgb(55 65 81 / 0.25)" : "rgb(17 24 39 / 0.75)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: smBreakpointUp ? "25%" : "96%",
                            minWidth: "fit-content",
                            backdropFilter: isLightMode ? "blur(8px) brightness(1.25) contrast(0.75)" : "blur(8px) brightness(1) contrast(1)",
                            justifyContent: smBreakpointUp ? "center" : "flex-start",
                            alignItems: "center",
                            py: 4,
                            borderRadius: 1,
                            border: 2,
                            borderColor: "rgb(55 65 81 / 1)",
                            boxShadow: 2,
                        }}
                    >

                        <Box>
                            <Link href="/">
                                <ApplicationLogo className="w-full h-25 fill-current text-gray-500"/>
                            </Link>
                        </Box>

                        <Box
                            sx={{
                                width: 1,
                                mt: 1,
                                px: 2,
                                py: 2,
                                overflow: "hidden",
                                borderRadius: 1, //?
                            }}
                        >
                            {children}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Theme>
    );
}
