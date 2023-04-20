import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link } from "@inertiajs/react";
import { Box, Typography } from "@mui/material";
import React from "react";

export default function MenuMainLink({ href, active, text, children }) {
    return (
        <Box
            sx={{
                width: "80%",
                height: "fit-content",
                mx: 1,
                my: 1,
                background: "#0073BB",
                borderRadius: 1,
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
                    <DashboardIcon sx={{ marginRight: 2, fontSize: "2rem" }} />

                    <Typography
                        align="center"
                        variant="h5"
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

{
    /*<Divider*/
}
{
    /*    sx={{*/
}
{
    /*        display: "block",*/
}
{
    /*        background:*/
}
{
    /*            "linear-gradient(90deg, rgba(31,40,62,1) 0%, rgba(255,255,255,0.5) 50%, rgba(31,40,62,1) 100%)",*/
}
{
    /*        height: "2px",*/
}
{
    /*        width: "80%",*/
}
{
    /*        mx: "auto",*/
}
{
    /*        my: 1,*/
}
{
    /*    }}*/
}
{
    /*/>*/
}
