import DashboardIcon from "@mui/icons-material/Dashboard";
import {Link} from "@inertiajs/react";
import {Box, Collapse, IconButton, Typography} from "@mui/material";
import {useState} from "react";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import isChildActive from "@/Functions/isChildActive";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function MenuMainLink({
                                         href,
                                         active,
                                         showContent,
                                         dropDown,
                                         text,
                                         children
                                     }) {
    const [showChildren, setShowChildren] = useState(
        isChildActive(children) || active
    );

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "40px",
                // mx: 1,
                my: 1,
                // pb: 0.5,
                background: "#0073BB",
                borderRadius: 1,
                position: "relative"
            }}
        >
            <Link href={href} className={"h-full min-h-[40px]"}>
                <Box
                    sx={{
                        width: 1,
                        height: 1,
                        minHeight: "40px",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        background: active ? "#014875" : "#0073BB",
                        borderRadius: 1,
                        color: "#ffffff",
                        "&:hover": {
                            cursor: "pointer",
                            background: "#038ce3"
                        }
                    }}
                >
                    <DashboardIcon
                        sx={{
                            mr: showContent ? 1 : "auto",
                            ml: showContent ? "" : "auto",
                            fontSize: "1rem"
                        }}
                    />
                    {showContent ? (
                        <Typography
                            align="center"
                            variant="h6"
                            sx={{
                                width: "fit-content",
                                position: "relative"
                            }}
                        >
                            {text}
                        </Typography>
                    ) : (
                        ""
                    )}
                </Box>
            </Link>
            {showContent ? (
                children !== undefined ? (
                    <IconButton
                        sx={{position: "absolute", top: "3px", right: "5px"}}
                        aria-label="down"
                        onClick={() => {
                            setShowChildren(!showChildren);
                        }}
                    >
                        {showChildren ? (
                            <KeyboardArrowDown sx={{color: "menuText.main"}}/>
                        ) : (
                            <KeyboardArrowUp sx={{color: "menuText.main"}}/>
                        )}
                    </IconButton>
                ) : (
                    ""
                )
            ) : (
                ""
            )}
            {showContent ? (
                <Collapse in={showChildren}>{children}</Collapse>
            ) : (
                ""
            )}
        </Box>
    );
}
