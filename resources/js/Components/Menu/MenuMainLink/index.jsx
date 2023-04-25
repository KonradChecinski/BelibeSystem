import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link } from "@inertiajs/react";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import isChildActive from "@/Components/Menu/Functions/isChildActive";

export default function MenuMainLink({
    href,
    active,
    dropDown,
    text,
    children,
}) {
    const [showChildren, setShowChildren] = useState(
        isChildActive(children) || active
    );

    return (
        <Box
            sx={{
                width: "80%",
                height: "fit-content",
                mx: 1,
                my: 1,
                background: "#0073BB",
                borderRadius: 1,
                position: "relative",
            }}
        >
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
                        color: "#ffffff",
                        "&:hover": {
                            cursor: "pointer",
                            background: "#038ce3",
                        },
                    }}
                >
                    <DashboardIcon sx={{ marginRight: 1, fontSize: "1rem" }} />

                    <Typography
                        align="center"
                        variant="h6"
                        sx={{
                            width: "fit-content",
                            position: "relative",
                        }}
                    >
                        {text}
                    </Typography>
                </Box>
            </Link>
            {children !== undefined ? (
                <IconButton
                    sx={{ position: "absolute", top: "3px", right: "5px" }}
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
