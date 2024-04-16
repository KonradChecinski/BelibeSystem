import React from "react";
import Typography from "@mui/material/Typography";
import {Box, Button, Checkbox, Divider, Tooltip} from "@mui/material";
import {Check, Close} from "@mui/icons-material";
import {Link} from "@inertiajs/react";

export const Node = ({node, depth}) => {
    const indent = depth * 3;
    // console.log(data.categories, node.id)


    return (
        <Box
            sx={{
                alignItems: "center",
                display: "grid",
                gridTemplateColumns: "1fr",
                height: "32px",
                paddingInlineEnd: "8px",
                paddingInlineStart: indent,
                position: "relative",
            }}
        >
            <Box sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: 1,
                pl: 1,
                height: 1,
                gap: 1,
                "&:hover": {
                    backgroundColor: "#1967d225",
                }
            }}>
                <Box
                    sx={{
                        paddingInlineStart: "8px",
                        display: "flex",
                        alignItems: "center",
                        width: 1
                    }}>
                    <Box sx={{width: 1}} component={Link} href={route('b2b.category', {slug: node.slug})}>
                        <Typography variant="body2" sx={{color: "menuText.main"}}>{node.name}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
};
