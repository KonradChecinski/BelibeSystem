import React from "react";
import {TypeIcon} from "./TypeIcon";
import {Box} from "@mui/material";
// import styles from "./CustomDragPreview.module.css";

export const CustomDragPreview = (props) => {
    const item = props.monitorProps.item;

    return (
        <Box
            sx={{
                alignItems: "center",
                bgColor: "#1967d2",
                borderRadius: "4px",
                boxShadow: "0 12px 24px -6px rgba(0, 0, 0, .25), 0 0 0 1px rgba(0, 0, 0, .08)",
                color: "#fff",
                display: "inline-grid",
                fontSize: "14px",
                gap: "8px",
                gridTemplateColumns: "auto auto",
                padding: "4px 8px",
                pointerEvents: "none",
            }}
        >
            <Box
                sx={{
                    alignItems: "center",
                    display: "flex",
                }}
            >
                <TypeIcon
                    droppable={item.droppable || false}
                    fileType={item?.data?.fileType}
                />
            </Box>
            <Box
                sx={{
                    alignItems: "center",
                    display: "flex",
                }}
            >
                {item.text}
            </Box>
        </Box>
    );
};
