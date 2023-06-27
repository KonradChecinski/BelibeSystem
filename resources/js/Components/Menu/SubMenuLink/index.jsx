import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link } from "@inertiajs/react";
import { Box, IconButton, Typography, Collapse } from "@mui/material";
import { useState } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import isChildActive from "@/Functions/isChildActive";

export default function SubMainLink({
                                        href,
                                        active,
                                        dropDown,
                                        text,
                                        children
                                    }) {
    const [showChildren, setShowChildren] = useState(
        isChildActive(children) || active
    );

    return (
        <Box sx={{ pl: 1.4, pt: 0.0, pr: 1.75, position: "relative" }}>
            <Link href={href}>
                <Box
                    sx={{
                        width: 1,
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        background: active ? "#014875" : "#0073BB",
                        borderRadius: 1,
                        // borderBottomRightRadius: 0,
                        // borderTopRightRadius: 0,
                        color: "#ffffff",
                        "&:hover": {
                            cursor: "pointer",
                            background: "#038ce3"
                        }
                    }}
                >
                    <Typography
                        align="center"
                        variant="body1"
                        sx={{
                            width: "fit-content",
                            position: "relative"
                        }}
                    >
                        {text}
                    </Typography>
                </Box>
            </Link>
            {children !== undefined ? (
                <IconButton
                    sx={{ position: "absolute", top: "0px", right: "5px" }}
                    aria-label="down"
                    onClick={() => {
                        setShowChildren(!showChildren);
                    }}
                >
                    {showChildren ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                </IconButton>
            ) : (
                ""
            )}
            <Collapse in={showChildren}>{children}</Collapse>
        </Box>
    );
}
