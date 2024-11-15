import {Box, Typography} from "@mui/material";
import B2BMenu from "@/Components/Layout/B2BMenu";
import {useTheme} from "@mui/material/styles";
import {useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import B2BAppBar from "@/Components/Layout/B2BAppBar";
import B2BFooter from "@/Layouts/Components/B2B/Footer/Footer";

export default function MobileLayout({
                                         auth,
                                         bgImage,
                                         categories,
                                         headerTitle,
                                         header,
                                         footer,
                                         children,
                                         fixed = true,
                                         accountManager,
                                         cart,
                                         clientId,
                                         blacklist,
                                         props
                                     }) {
    const theme = useTheme();
    const [showMenu, setShowMenu] = useState(useMediaQuery(theme.breakpoints.up("md")));

    const [lgBreakpointUp, setLgBreakpointUp] = useState(useMediaQuery(theme.breakpoints.up("lg")));
    const lgBreakpointDown = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <>
            <B2BAppBar position={"fixed"} cart={cart} clientId={clientId} accountManager={accountManager}>
                <B2BMenu showContent={showMenu} auth={auth} bgImage={bgImage}
                         categories={categories}
                         accountManager={accountManager} header={header}/>
            </B2BAppBar>
            <Box sx={{width: 1, height: 70}}></Box>
            <Box>
                <Typography variant="h4" sx={{my: 1, mx: 1, pt: 1}}>{headerTitle}</Typography>

                {children}
            </Box>
            <Box
                sx={{
                    mt: 2,
                    // height: "400px",
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "menuText.main"
                }}
            >
                <B2BFooter footer={footer} props={props}/>
            </Box>
        </>
    );
}
