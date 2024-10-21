import {Box, Typography} from "@mui/material";
import B2BMenu from "@/Components/Layout/B2BMenu";
import B2BNavBar from "@/Components/Layout/B2BNavBar";
import B2BDynamicMenu from "@/Components/Layout/B2BDynamicMenu";
import AppBar from "@/Components/Layout/AppBar";
import {useTheme} from "@mui/material/styles";
import {useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function MobileLayout({
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
    const [showMenu, setShowMenu] = useState(useMediaQuery(theme.breakpoints.up("md")));

    const [lgBreakpointUp, setLgBreakpointUp] = useState(useMediaQuery(theme.breakpoints.up("lg")));
    const lgBreakpointDown = useMediaQuery(theme.breakpoints.down("lg"));


    return (
        <>
            {/*<AppBar position={"static"}></AppBar>*/}
            <AppBar position={"fixed"}>
                <B2BMenu showContent={showMenu} auth={auth} bgImage={bgImage}
                         categories={categories}
                         accountManager={accountManager}/>
            </AppBar>
            <Box sx={{width: 1, height: 70}}></Box>
            <Box>
                {children}
            </Box>
            <Box
                sx={{
                    mt: 2,
                    height: "400px",
                    bgcolor: "rgba(0,0,0,0.5)",
                }}
            >

            </Box>
        </>
    );
}
