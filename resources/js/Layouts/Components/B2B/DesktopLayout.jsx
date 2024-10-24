import {Box, Typography} from "@mui/material";
import B2BMenu from "@/Components/Layout/B2BMenu";
import B2BNavBar from "@/Components/Layout/B2BNavBar";
import B2BDynamicMenu from "@/Components/Layout/B2BDynamicMenu";
import {useTheme} from "@mui/material/styles";
import {useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {config as PuckMuiConfig} from "puck-mui/dist/config";
import {Render} from "@measured/puck";
import {PDivider, PHeading, PParagraph, PTypography, PColumns} from 'puck-mui';
import B2BFooter from "@/Layouts/Components/B2B/Footer/Footer";

export default function DesktopLayout({
                                          auth,
                                          bgImage,
                                          categories,
                                          header,
                                          headerMenu,
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
            <Box
                sx={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    m: 1,
                }}
            > {/*Góra*/}
                <Box
                    sx={{
                        width: "14%",
                        [theme.breakpoints.down("lg")]: {
                            width: "20%",
                        }
                    }}
                > {/*Lewo*/}

                    <Box
                        onMouseOver={() => setShowMenu(true)}
                        onMouseOut={() => setShowMenu(false)}
                        sx={{
                            height: "calc(100vh - 16px)",
                            position: "sticky",
                            top: 8,


                            zIndex: 1000,
                            transition: "all .5s ease-in-out;",
                        }}
                    >
                        <B2BMenu showContent={showMenu} auth={auth} bgImage={bgImage}
                                 categories={categories}
                                 accountManager={accountManager}/>
                    </Box>


                </Box>
                <Box
                    sx={{
                        flex: 1,

                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                > {/*Prawo*/}

                    {Boolean(blacklist) && (
                        <Box>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                bgcolor: "red",
                                borderRadius: 1,
                                // my: 1,
                                p: 1
                            }}
                            >
                                <Typography variant="h6" component="h6">
                                    Twoje konto zostało zablokowane. Nie masz możliwości składania
                                    zamówień. W
                                    razie
                                    pytań
                                    skontaktuj się z opiekunem.
                                </Typography>
                            </Box>
                        </Box>
                    )} {/*Prawo góra*/}
                    <Box
                        sx={{
                            position: "sticky",
                            top: 8,

                            zIndex: 1000,
                        }}
                    > {/*Prawo nav*/}
                        <Box>
                            <Box>
                                <B2BNavBar clientId={clientId} cart={cart} auth={auth}
                                           accountManager={accountManager}/>
                                <B2BDynamicMenu auth={auth} menu={[]}/>
                            </Box>
                        </Box>
                    </Box>


                    <Box> {/*Prawo body*/}
                        <Typography variant="h4" sx={{my: 1, mx: 1, pt: 1}}>{header}</Typography>

                        {children}
                    </Box>
                </Box>

            </Box>

            <Box
                sx={{
                    height: "400px",
                    bgcolor: "rgba(0,0,0,0.5)",
                }}
            >
                <B2BFooter footer={footer} props={props}/>
            </Box>

        </>
    );
}
