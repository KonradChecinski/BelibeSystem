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

export default function ClientLayout({props, header, children}) {
    const theme = useTheme();
    const mdBreakpointUp = useMediaQuery(theme.breakpoints.up("md"));
    const smBreakpointUp = useMediaQuery(theme.breakpoints.up("sm"));

    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [showMenu, setShowMenu] = useState(useMediaQuery(theme.breakpoints.up("md")));

    const auth = props.auth
    const errors = props.errors
    const categories = props.menu
    const bgImage = props.backgroundImage
    const accountManager = props.accountManager
    const cart = props.cartSummary
    const clientId = props.clientId
    const blacklist = props.blacklist

    const headerMenu = props.header
    const footer = props.footer

    return (
        <Theme>
            <Box
                sx={{
                    // width: "100vw",
                    // height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    // gap: 1,
                    width: 1,
                }}
            >

                {
                    !isMobile ?
                        (
                            <DesktopLayout key={"desktop"} auth={auth} bgImage={bgImage} categories={categories}
                                           headerTitle={header} footer={footer} header={headerMenu}
                                           accountManager={accountManager} cart={cart} clientId={clientId}
                                           blacklist={blacklist} children={children} props={props}/>
                        )
                        :
                        (

                            <MobileLayout key={"mobile"} auth={auth} bgImage={bgImage} categories={categories}
                                          headerTitle={header} footer={footer} header={headerMenu}
                                          accountManager={accountManager} cart={cart} clientId={clientId}
                                          blacklist={blacklist} children={children} props={props}/>

                        )
                }

            </Box>


        </Theme>
    );
}
