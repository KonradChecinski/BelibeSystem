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

    let lightTheme = {
        primary: {
            // main: "#1A2035",
            main: "#2a54d9",
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
        gradient: {
            divider:
                "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(31,40,62,1) 50%, rgba(255,255,255,0.5) 100%)"
        },
        menuText: {
            main: "#ffffff",
        },
        barcodes: {
            background: "rgba(243, 244, 246, 0.38)",
        },
        field: {
            border: "rgb(229, 231, 235)"
        }
    };

    let darkTheme = {
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
        gradient: {
            divider:
                "linear-gradient(90deg, rgba(31,40,62,1) 0%, rgba(255,255,255,0.5) 50%, rgba(31,40,62,1) 100%)"
        },
        menuText: {
            main: "#ffffff",
        },
        barcodes: {
            background: "rgba(17, 24, 39, 0.38)",
        },
        field: {
            border: "rgba(229, 231, 235, 0.3)"
        }
    };

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

//         palette: {
//         mode,
//     ...(mode === 'light'
//             ? {
//                 // palette values for light mode
//                 primary: amber,
//                 divider: amber[200],
//                 text: {
//                     primary: grey[900],
//                     secondary: grey[800],
//                 },
//             }
//             : {
//                 // palette values for dark mode
//                 primary: deepOrange,
//                 divider: deepOrange[700],
//                 background: {
//                     default: deepOrange[900],
//                     paper: deepOrange[900],
//                 },
//                 text: {
//                     primary: '#fff',
//                     secondary: grey[500],
//                 },
//             }),
//     },
// });
