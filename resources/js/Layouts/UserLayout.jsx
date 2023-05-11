import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Theme from "@/Theme/Theme";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Menu from "@/Components/Menu";
import Navbar from "@/Components/NavBar";
import AppBar from "@/Components/AppBar";

export default function UserLayout({ auth, header, children }) {
    const theme = useTheme();
    const mdBreakpointUp = useMediaQuery(theme.breakpoints.up("md"));
    const smBreakpointUp = useMediaQuery(theme.breakpoints.up("sm"));
    const [showMenu, setShowMenu] = useState(
        useMediaQuery(theme.breakpoints.up("md"))
    );

    return (
        <>
            <Theme>
                {smBreakpointUp ? (
                    <>
                        <Box
                            onMouseOver={() => setShowMenu(true)}
                            onMouseOut={() => setShowMenu(false)}
                            sx={{
                                position: "fixed",
                                top: "1%",
                                left: ".5%",
                                zIndex: 1001,
                                height: "98vh",
                                width: "16%",
                                minWidth: "200px",
                                transition: "all .5s ease-in-out;",
                                [theme.breakpoints.down("md")]: {
                                    width: "80px",
                                    minWidth: "80px",
                                    "&: hover": {
                                        width: "16%",
                                        minWidth: "200px"
                                    }
                                }
                            }}
                        >
                            <Menu showContent={showMenu} />
                        </Box>

                        <Box
                            sx={{
                                position: "fixed",
                                top: "1%",
                                right: ".5%",
                                zIndex: 1000,
                                height: "72px",
                                width: "min(82.5%, calc(100% - 215px))",
                                transition: "all .5s ease-in-out;",
                                [theme.breakpoints.down("md")]: {
                                    width: "calc(100% - 95px)"
                                }
                            }}
                        >
                            <Navbar auth={auth} />
                        </Box>
                    </>
                ) : (
                    <>
                        <AppBar position={"static"}></AppBar>
                        <AppBar position={"fixed"}>
                            <Menu showContent={true} />
                        </AppBar>
                    </>
                )}

                <Box
                    sx={{
                        [theme.breakpoints.down("sm")]: {
                            m: 1
                        },
                        [theme.breakpoints.up("sm")]: {
                            marginLeft: "100px",
                            marginTop: "90px"
                        },
                        [theme.breakpoints.up("md")]: {
                            marginLeft: "max(17%,220px)",
                            marginRight: "10px",
                            marginTop: "90px",
                            marginBottom: "10px"
                        }
                    }}
                >
                    <Typography variant="h4" sx={{ my: 2, mx: 1, pt: 1 }}>{header}</Typography>

                    {children}
                </Box>
            </Theme>
        </>
    );
}
