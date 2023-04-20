import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link } from "@inertiajs/react";
import { Box, Typography } from "@mui/material";
import React from "react";

export default function SubMainLink({ href, active, text, children }) {
    return (
        <Box sx={{ pl: 3 }}>
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
                    <Typography
                        align="center"
                        variant="body1"
                        sx={{
                            width: "fit-content",
                            position: "relative",
                        }}
                    >
                        {text}
                    </Typography>
                </Box>
            </Link>
            {children}
        </Box>
    );
}
