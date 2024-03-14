import React from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {Box, Button, Checkbox, Divider, IconButton, Switch, Tooltip} from "@mui/material";
import {getDescendants, useDragOver} from "@minoru/react-dnd-treeview";
import {Favorite, FavoriteBorder, DragHandle, Edit, Check, CheckBoxOutlineBlank, Close} from "@mui/icons-material";

export const CustomNode = (props) => {
    const {id, droppable, data, parent} = props.node;
    const treeData = props.treeData;
    const depth = props.depth;
    const getPipeHeight = props.getPipeHeight;
    const setEditedId = props.setEditedId;
    const handleRef = props.handleRef;
    const indent = props.depth * 3;
    // console.log(props)

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
                gridTemplateColumns: "auto 1fr",
                height: "32px",
                paddingInlineEnd: "8px",
                paddingInlineStart: indent,
                position: "relative",
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
                {props.node.droppable && treeData.find(e => e.parent === id) && (
                    <div onClick={handleToggle}>
                        <ArrowRightIcon/>
                    </div>
                )}
            </Box>
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
                <Box ref={handleRef} sx={{cursor: "pointer"}}>
                    <DragHandle/>
                </Box>
                {/*{*/}
                {/*    depth !== 0 ?*/}
                {/*        <Box*/}
                {/*            sx={{*/}
                {/*                position: "absolute",*/}
                {/*                left: indent * 4,*/}
                {/*                top: "15px",*/}
                {/*                height: "2px",*/}
                {/*                bgcolor: "#e7e7e7",*/}
                {/*                // bgcolor: "#ff0000",*/}
                {/*                // zIndex: "-1",*/}
                {/*                width: depth > 0 ? indent * 5 : 0*/}
                {/*            }}*/}
                {/*        >*/}
                {/*        </Box>*/}
                {/*        : ""*/}
                {/*}*/}


                {/*{getDescendants(treeData, parent)[0].id === id && depth !== 0 && (*/}
                {/*    <Box*/}
                {/*        sx={{*/}
                {/*            position: "absolute",*/}
                {/*            borderLeft: "2px solid #e7e7e7",*/}
                {/*            left: indent * 4,*/}
                {/*            top: "-15px",*/}
                {/*            height: Math.max(0, getPipeHeight(parent, treeData))*/}
                {/*        }}*/}
                {/*    >*/}
                {/*    </Box>*/}

                {/*)}*/}
                <Divider orientation={"vertical"} flexItem/>
                <Box
                    sx={{
                        paddingInlineStart: "8px",
                        display: "flex",
                        alignItems: "center",
                        width: 1
                    }}>
                    <Typography variant="body2">{props.node.text}</Typography>


                </Box>
                <Divider orientation={"vertical"} flexItem/>
                <Tooltip title="Ilość klientów ze zniżką na tą kategorię" arrow>
                    <Typography variant="body2" sx={{width: 40}}
                                textAlign={"center"}>{props.node.clients_discounts_count}</Typography>
                </Tooltip>
                <Divider orientation={"vertical"} flexItem/>
                <Tooltip title="Ilość produktów w tej kategorii" arrow>
                    <Typography variant="body2" sx={{width: 40}}
                                textAlign={"center"}>{props.node.product_models_count}</Typography>
                </Tooltip>
                <Divider orientation={"vertical"} flexItem/>
                <Tooltip title="Widoczność kategorii" arrow>
                    {data?.show_in_menu ?
                        <Check/>
                        :
                        <Close/>
                    }
                </Tooltip>


                <Divider orientation={"vertical"} flexItem/>
                <IconButton aria-label="edit" size={"small"} onClick={() => setEditedId(id)}>
                    <Edit/>
                </IconButton>


            </Box>

        </Box>
    )
        ;
};
