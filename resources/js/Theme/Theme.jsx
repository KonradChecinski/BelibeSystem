import {
    createTheme,
    CssBaseline,
    ThemeProvider,
    useMediaQuery
} from "@mui/material";
import { useMemo } from "react";

export default function Theme({ children }) {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    let lightTheme = {
        primary: {
            // main: "#1A2035",
            main: "#2a54d9"
        },
        // secondary: {},
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
        }
    };

    let darkTheme = {
        primary: {
            // main: "#1A2035",
            main: "#e4e6ee"
        },
        // secondary: {},
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
        }
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? "dark" : "light",
                    ...(prefersDarkMode ? { ...darkTheme } : { ...lightTheme })
                },
                typography: {
                    fontSize: 11
                },
                shape: {
                    borderRadius: 16
                }
            }),

        [prefersDarkMode]
    );
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
