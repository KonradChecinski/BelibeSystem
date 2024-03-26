import React from "react";
import Typography from "@mui/material/Typography";
import {Box, Button, Checkbox, Divider, Tooltip} from "@mui/material";
import {
    Check,
    CheckBox,
    CheckBoxOutlineBlank,
    CheckBoxOutlined,
    Close,
    IndeterminateCheckBox, RadioButtonChecked, RadioButtonUnchecked
} from "@mui/icons-material";


export const Node = ({node, depth, hasChild, categories, data, setData, setEdited}) => {
    const indent = depth * 3;
    // console.log(data.categories, node.id)

    const handleOnChange = (event, checked) => {
        if (checked) {
            setData({
                ...data,
                categories: [...data.categories, node.id, ...getMissingParentId(node)]
            })
        } else {
            let parentWithoutChildren = findParentWithoutChildren(node).map(p => p.id);
            setData({
                ...data,
                categories: data.categories.filter((value) => {
                    return value !== node.id && !findParentWithoutChildren(node).map(p => p.id).includes(value);
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

    const findParentWithoutChildren = (node) => {
        let parents = [];
        let parent = categories.find(c => c.id === node.parent);
        if (parent) {
            let children = categories.filter(c => c.parent === parent.id);
            let otherChildren = children.filter(c => c.id !== node.id && data.categories.includes(c.id));
            if (parent && otherChildren.length === 0) {
                parents.push(parent);
                parent = findParentWithoutChildren(parent, node);
                if (parent) parents.push(...parent);
                return parents;
            }
        }

        return parents;
    }
    const findChildren = (node) => {
        let childrenArray = [];
        let children = categories.filter(c => c.parent === node.id);
        if (children.length !== 0) {
            children.forEach(c => {
                childrenArray.push(c);
                let children2 = findChildren(c);
                childrenArray.push(...children2);
                return childrenArray;
            })
        }
        return childrenArray
    }
    const getPipeHeight = (node) => {
        let children = findChildren(node);
        let height = 0;
        children.forEach(c => {
            height += 32;
        })
        return height;
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
            <Box
                // className={"pipeY-" + node.name}
                sx={{
                    position: "absolute",
                    top: 36,
                    left: 25 + indent * 8,
                    width: 2,
                    height: getPipeHeight(node) - 16,
                    bgcolor: "field.border",
                }}
            />
            <Box
                // className={"pipeX-" + node.name}
                sx={{
                    width: depth > 0 ? 22 - 9 : 0,
                    position: "absolute",
                    left: 2 + indent * 8,
                    top: 18,
                    height: "2px",
                    bgcolor: "field.border",
                }}
            />
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
                <Checkbox
                    checked={Boolean(data.categories.includes(node.id))}
                    onChange={handleOnChange}
                    disabled={hasChild}
                    icon={hasChild ? <RadioButtonUnchecked/> : <CheckBoxOutlineBlank color={"primary"}/>}
                    checkedIcon={hasChild ? <RadioButtonChecked/> : <CheckBox/>}
                />
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
