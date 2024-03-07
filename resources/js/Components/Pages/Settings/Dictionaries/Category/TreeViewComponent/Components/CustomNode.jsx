import React from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {TypeIcon} from "./TypeIcon";
import {Box} from "@mui/material";
import {useDragOver} from "@minoru/react-dnd-treeview";

export const CustomNode = (props) => {
    const {id, droppable, data} = props.node;
    const indent = props.depth * 3;

    const handleToggle = (e) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    };

    const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

    return (
        <Box
            sx={{
                alignItems: "center",
                display: "grid",
                gridTemplateColumns: "auto auto 1fr auto",
                height: "32px",
                paddingInlineEnd: "8px",
                paddingInlineStart: indent,
            }}
            {...dragOverProps}
        >
            <Box
                sx={{
                    alignItems: "center",
                    fontSize: 0,
                    cursor: "pointer",
                    display: "flex",
                    height: "24px",
                    justifyContent: "center",
                    width: "24px",
                    transition: "transform linear .1s",
                    transform: props.isOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
            >
                {props.node.droppable && (
                    <div onClick={handleToggle}>
                        <ArrowRightIcon/>
                    </div>
                )}
            </Box>
            <Box>
                <TypeIcon droppable={droppable || false} fileType={data?.fileType}/>
            </Box>
            <Box
                sx={{
                    paddingInlineStart: "8px",
                }}>
                <Typography variant="body2">{props.node.text}</Typography>
                <Typography variant="body2">{data?.fileType}</Typography>
            </Box>
        </Box>
    )
        ;
};
