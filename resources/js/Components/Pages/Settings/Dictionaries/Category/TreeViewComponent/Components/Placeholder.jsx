import React from "react";
import {Box} from "@mui/material";
// import styles from "./Placeholder.module.css";

export const Placeholder = (props) => {
    const left = props.depth * 3 * 8 + 16;
    return (
        <Box
            sx={{
                bgcolor: "#1967d2",
                height: "2px",
                position: "absolute",
                right: 5,
                top: "0",
                transform: "translateY(-50%)",
                left: left,
            }}
        >
        </Box>);
};
