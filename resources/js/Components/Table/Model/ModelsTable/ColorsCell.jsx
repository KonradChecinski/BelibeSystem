import {Box, Typography} from "@mui/material";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import React from "react";

export default function ColorsCell({colors}) {
    return (
        <Box
            sx={{
                height: 1,
                maxHeight: 1,
                width: 1,
                display: "flex",
                flexDirection: "column",
                // justifyContent: "center",
                alignItems: "flex-start",
                gap: 0.5,
                overflowY: "auto",
                overflowX: "hidden",
                py: 0.5,
                "&::before, &::after": {
                    content: '""',
                    margin: 'auto',
                }
            }}>
            {colors.sort(sortByColorShortcut).map((value, key) => (
                    <Box
                        key={key}
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: 2,
                            width: 1
                        }}>
                        {value.color_icon?.type === 1 ?
                            <Box
                                component={"img"}
                                src={route("colorIcons", {path: value.color_icon.path})}
                                sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "100%",
                                    border: 1
                                }}/>
                            :
                            <Box sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "100%",
                                bgcolor: value.color_icon?.hex,
                                border: 1
                            }}/>
                        }
                        <Typography sx={{fontSize: "11px", height: 20, width: 1}}>
                            {value.shortcut} - {value.name}
                        </Typography>
                    </Box>
                )
            )}
        </Box>
    );
}
