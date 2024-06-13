import {useState} from "react";
import Theme from "@/Theme/Theme";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Box, Typography} from "@mui/material";
import Menu from "@/Components/Layout/Menu";
import Navbar from "@/Components/Layout/NavBar";
import AppBar from "@/Components/Layout/AppBar";
import B2BNavBar from "@/Components/Layout/B2BNavBar";
import B2BMenu from "@/Components/Layout/B2BMenu";

export default function ClientLayout({
                                         auth,
                                         bgImage,
                                         categories,
                                         header,
                                         children,
                                         fixed = true,
                                         accountManager,
                                         cart,
                                         clientId,
                                         blacklist
                                     }) {
    const theme = useTheme();
    const mdBreakpointUp = useMediaQuery(theme.breakpoints.up("md"));
    const smBreakpointUp = useMediaQuery(theme.breakpoints.up("sm"));
    const [showMenu, setShowMenu] = useState(
        useMediaQuery(theme.breakpoints.up("md"))
    );

    return (
        <Theme>
            {smBreakpointUp ? (
                <>
                    <Box
                        onMouseOver={() => setShowMenu(true)}
                        onMouseOut={() => setShowMenu(false)}
                        sx={{
                            position: fixed ? "fixed" : "absolute",
                            top: "1%",
                            bottom: "8px",
                            left: ".5%",
                            zIndex: 1001,
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
                        <B2BMenu showContent={showMenu} auth={auth} bgImage={bgImage} categories={categories}
                                 accountManager={accountManager}/>
                    </Box>

                    <Box
                        sx={{
                            position: fixed ? "fixed" : "absolute",
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
                        {Boolean(blacklist) && (
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                bgcolor: "red",
                                borderRadius: 1,
                                my: 1,
                                p: 0.5
                            }}>
                                <Typography variant="h6" component="h6">
                                    Twoje konto zostało zablokowane. Nie masz możliwości składania zamówień. W razie
                                    pytań
                                    skontaktuj się z opiekunem.
                                </Typography>
                            </Box>
                        )}

                        <B2BNavBar auth={auth} clientId={clientId} cart={cart}/>
                    </Box>
                </>
            ) : (
                <>
                    <AppBar position={"static"}></AppBar>
                    <AppBar position={"fixed"}>
                        <B2BMenu showContent={showMenu} auth={auth} bgImage={bgImage} categories={categories}
                                 accountManager={accountManager}/>
                    </AppBar>
                </>
            )}

            <Box
                sx={{
                    // width: "100%",
                    height: "calc(100% - 82px)",
                    [theme.breakpoints.down("sm")]: {
                        m: 1
                    },
                    [theme.breakpoints.up("sm")]: {
                        marginLeft: "100px",
                        paddingTop: "90px"
                    },
                    [theme.breakpoints.up("md")]: {
                        marginLeft: "max(17%,220px)",
                        marginRight: "10px",
                        paddingTop: "90px",
                        marginBottom: "10px"
                    }
                }}
            >
                <Typography variant="h4" sx={{my: 2, mx: 1, pt: 1}}>{header}</Typography>

                {children}
            </Box>
        </Theme>
    );
}
