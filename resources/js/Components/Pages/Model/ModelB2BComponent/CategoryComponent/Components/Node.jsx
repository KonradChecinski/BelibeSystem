import React from "react";
import Typography from "@mui/material/Typography";
import {Box, Button, Checkbox, Divider, Tooltip} from "@mui/material";
import {Check, Close} from "@mui/icons-material";

export const Node = ({node, depth, categories, data, setData, setEdited}) => {
    const indent = depth * 3;
    // console.log(data.categories, node.id)

    const handleOnChange = (event, checked) => {
        if (checked) {
            setData({
                ...data,
                categories: [...data.categories, node.id, ...getMissingParentId(node)]
            })
        } else {
            setData({
                ...data,
                categories: data.categories.filter((value) => {
                    return value !== node.id;
                })
            })
        }
        setEdited(true);
    }

    const getMissingParentId = (node) => {
        const parents = findParent(node);
        const parentsId = parents.map(p => p.id);
        const missing = parentsId.filter(p => !data.categories.includes(p));
        return missing
    }

    const findParent = (node) => {
        let parents = [];
        let parent = categories.find(c => c.id === node.parent);
        if (parent) {
            parents.push(parent);
            parent = findParent(parent);
            if (parent) parents.push(...parent);
            return parents;
        }
        return parents;
    }


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
                <Checkbox checked={Boolean(data.categories.includes(node.id))} onChange={handleOnChange}/>
                <Divider orientation={"vertical"} flexItem/>
                <Box
                    sx={{
                        paddingInlineStart: "8px",
                        display: "flex",
                        alignItems: "center",
                        width: 1
                    }}>
                    <Typography variant="body2">{node.name}</Typography>
                </Box>
                <Divider orientation={"vertical"} flexItem/>
                <Tooltip title="Widoczność kategorii" arrow sx={{mr: 1}}>
                    {node.show_in_menu ?
                        <Check/>
                        :
                        <Close/>
                    }
                </Tooltip>
            </Box>
        </Box>
    )
};
