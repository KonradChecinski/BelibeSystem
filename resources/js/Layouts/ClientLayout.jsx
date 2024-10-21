import {useState} from "react";
import Theme from "@/Theme/Theme";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Box, Typography} from "@mui/material";
// // import Menu from "@/Components/Layout/Menu";
// import Navbar from "@/Components/Layout/NavBar";
import AppBar from "@/Components/Layout/AppBar";
import B2BNavBar from "@/Components/Layout/B2BNavBar";
import B2BMenu from "@/Components/Layout/B2BMenu";
import B2BDynamicMenu from "@/Components/Layout/B2BDynamicMenu";
import DesktopLayout from "@/Layouts/Components/B2B/DesktopLayout";
import MobileLayout from "@/Layouts/Components/B2B/MobileLayout";

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

    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [showMenu, setShowMenu] = useState(useMediaQuery(theme.breakpoints.up("md")));


    return (
        <Theme>
            <Box
                sx={{
                    // width: "100vw",
                    // height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    // gap: 1,
                }}
            >

                {
                    !isMobile ?
                        (
                            <DesktopLayout key={"desktop"} auth={auth} bgImage={bgImage} categories={categories}
                                           header={header}
                                           accountManager={accountManager} cart={cart} clientId={clientId}
                                           blacklist={blacklist} children={children}/>
                        )
                        :
                        (
                            <>
                                <MobileLayout key={"mobile"} auth={auth} bgImage={bgImage} categories={categories}
                                              header={header}
                                              accountManager={accountManager} cart={cart} clientId={clientId}
                                              blacklist={blacklist} children={children}/>
                            </>
                        )
                }

            </Box>


        </Theme>
    );
}
