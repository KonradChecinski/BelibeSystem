import {
    createTheme,
    CssBaseline,
    ThemeProvider,
    useMediaQuery
} from "@mui/material";
import {plPL} from '@mui/material/locale';
import {useMemo} from "react";

export default function Theme({children}) {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");


    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? "dark" : "light",
                    ...(prefersDarkMode ? {...darkTheme} : {...lightTheme})
                },
                typography: {
                    fontSize: 11
                },
                shape: {
                    borderRadius: 16
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                // scrollbarColor: "#6b6b6b #2b2b2b",
                                "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                                    backgroundColor: prefersDarkMode ? "#1f2937" : "#c2c2c2",
                                    right: 0,
                                    width: "12px",
                                    height: "12px",
                                },
                                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                                    borderRadius: 8,
                                    // backgroundColor: "#6b6b6b",
                                    // border: "3px solid #2b2b2b",
                                    backgroundColor: prefersDarkMode ? "#525760" : "#a1a1a1",
                                    width: "12px",
                                    height: "12px",
                                },
                                "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                                    backgroundColor: prefersDarkMode ? "#7c838d" : "#7a7a7a",
                                },
                                "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                                    backgroundColor: prefersDarkMode ? "#7c838d" : "#7a7a7a",
                                },
                                "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                                    backgroundColor: prefersDarkMode ? "#6b727c" : "#818181",
                                },
                                "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                                    backgroundColor: prefersDarkMode ? "#1f2937" : "#c2c2c2",
                                },
                            }
                        }
                    }
                }
            }, plPL),

        [prefersDarkMode]
    );
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    );
}


export const lightTheme = {
    primary: {
        // main: "#1A2035",
        main: "#1D71B8",
        second: "rgba(0,0,0,0.08)",
        third: "rgba(0,0,0,0.25)"
    },
    secondary: {main: "#2a53d7"},
    background: {
        background: "#f3f4f6",
        default: "#f3f4f6",
        paper: "#ffffff",
        card: "#ffffff",
        toolbar: "#ffffff"
    },
    errorBg: {
        main: "#ff00001a",
    },
    successBg: {
        main: "#00ad1b66",
    },
    gradient: {
        divider:
            "linear-gradient(90deg, #038ce3 0%, #014875 50%, #038ce3 100%)"
    },
    menuText: {
        main: "#ffffff",
    },
    barcodes: {
        background: "rgba(243, 244, 246, 0.38)",
    },
    field: {
        border: "rgb(229, 231, 235)"
    },
    disabled: {
        background: "rgba(181,181,181,0.33)"
    },
    hoveredCell: {
        background: "rgba(4,119,243,0.26)"
    }
};

export const darkTheme = {
    primary: {
        // main: "#1A2035",
        main: "#e4e6ee",
        second: "rgba(255,255,255,0.08)",
        third: "rgba(255,255,255,0.25)"
    },
    secondary: {main: "#0072ba"},
    background: {
        background: "#111827",
        default: "#111827",
        paper: "#1f2937",
        card: "#1f2937",
        toolbar: "#1f2937"
    },
    errorBg: {
        main: "#ff00001a",
    },
    successBg: {
        main: "#00ad1b66",
    },
    gradient: {
        divider:
            "linear-gradient(90deg, #1f2937 0%, #2a3441 50%, #1f2937 100%)"
    },
    menuText: {
        main: "#ffffff",
    },
    barcodes: {
        background: "rgba(17, 24, 39, 0.38)",
    },
    field: {
        border: "rgba(229, 231, 235, 0.3)"
    },
    disabled: {
        background: "rgba(124,124,124,0.33)"
    },
    hoveredCell: {
        background: "rgba(4,119,243,0.26)"
    }
};
