import React, {useEffect, useState} from "react";
import {DndProvider} from "react-dnd";
import {getBackendOptions, getDescendants, MultiBackend, Tree} from "@minoru/react-dnd-treeview";
import {CustomNode} from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/CustomNode";
import {
    CustomDragPreview
} from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/CustomDragPreview";
import {Placeholder} from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/Placeholder";
import styles from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/Tree.module.css";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Fade,
    Grid,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import useTreeOpenHandler
    from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/useTreeOpenHandler";
import {Cancel, Edit, Save} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {useForm} from "@inertiajs/react";

const reorderArray = (array, sourceIndex, targetIndex) => {
    const newArray = [...array];
    const element = newArray.splice(sourceIndex, 1)[0];
    newArray.splice(targetIndex, 0, element);
    return newArray;
};

export default function TreeViewComponent(props) {

    const {ref, getPipeHeight, toggle} = useTreeOpenHandler();
    const [edited, setEdited] = useState(false);
    const [editedId, setEditedId] = useState(null);
    const {data, setData, processing, post} = useForm(props.categories.map(e => (
        {
            ...e,
            droppable: true,
            text: e.name,
            data: {
                show_in_menu: e.show_in_menu,
            }
        }
    )));
    const resetForm = () => {
        setData(props.categories.map(e => (
            {
                ...e,
                droppable: true,
                text: e.name,
                data: {
                    show_in_menu: e.show_in_menu,
                }
            }
        )))
    }
    const saveBasic = () => {
        console.log(data)
        // post(route("system.clients.client.update.additional", {client: data.id}), {
        //     onSuccess: params => {
        //         setEdited(false);
        //         enqueueSnackbar("Zapisano dodatkowe informację", {variant: 'success'})
        //     },
        //     onError: params => {
        //         console.error(params)
        //         enqueueSnackbar("Błąd przy zapisywaniu dodatkowych informacji", {variant: 'error'})
        //     },
        //     preserveScroll: true
        // })
    }

    const handleDrop = (newTreeData, dnd, f) => {
        let treeData = newTreeData.slice();
        treeData = sortTreeData(treeData);
        setData(treeData)
        setEdited(true);
    }
    const sortTreeData = (treeData) => {
        const sortTreeDataChildrten = (unsortedTreeData, sortedTreeData, nodeId) => {
            const children = unsortedTreeData.filter(e => e.parent === nodeId);
            if (children.length === 0) return;
            children.forEach(child => {
                sortedTreeData.push(child);
                unsortedTreeData.splice(unsortedTreeData.indexOf(child), 1);
                sortTreeDataChildrten(unsortedTreeData, sortedTreeData, child.id);
            });
        }

        const unsortedTreeData = treeData.slice();
        const sortedTreeData = [];

        while (unsortedTreeData.length > 0) {
            const node = unsortedTreeData.find(e => e.parent === 0);
            const nodeId = node.id;

            sortedTreeData.push(node);
            unsortedTreeData.splice(unsortedTreeData.indexOf(node), 1);

            sortTreeDataChildrten(unsortedTreeData, sortedTreeData, nodeId);
        }
        return sortedTreeData;
    }

    // const sortTreeData = (treeData) => {
    //     const unsortedTreeData = treeData.slice();
    //     const sortedTreeData = [];
    //
    //     while (unsortedTreeData.length > 0) {
    //         const node = unsortedTreeData.find(e => e.parent === 0);
    //         if (node) {
    //             const nodeId = node.id;
    //             sortedTreeData.push(node);
    //             unsortedTreeData.splice(unsortedTreeData.indexOf(node), 1);
    //             const children = unsortedTreeData.filter(e => e.parent === nodeId);
    //             children.forEach(child => {
    //                 sortedTreeData.push(child);
    //                 unsortedTreeData.splice(unsortedTreeData.indexOf(child), 1);
    //             });
    //         } else {
    //             const node = unsortedTreeData[0];
    //             unsortedTreeData.splice(unsortedTreeData.indexOf(node), 1);
    //             const parent = sortedTreeData.find(e => e.id === node.parent);
    //             sortedTreeData.splice(sortedTreeData.indexOf(parent) + 1, 0, node);
    //             console.log(unsortedTreeData, sortedTreeData)
    //             // return sortTreeData(sortedTreeData);
    //             return sortedTreeData;
    //         }
    //
    //     }
    //     console.log(treeData, sortedTreeData)
    //     return sortedTreeData;
    // }

    return (
        <Grid container spacing={2} sx={{height: 1}}>
            <Grid item xs={12} md={6} sx={{position: "relative"}}>
                <Paper sx={{height: 1, p: 1, pt: 2}}>
                    <Box
                        sx={{
                            overflowY: "auto",
                            height: 1,
                        }}>
                        <Typography variant={"h6"}>Kolejność kategorii</Typography>
                        <Divider sx={{my: 1}}/>
                        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                            <Tree
                                tree={data}
                                rootId={0}
                                render={(node, {depth, isOpen, onToggle, handleRef}) => (
                                    <CustomNode
                                        node={node}
                                        depth={depth}
                                        isOpen={isOpen}
                                        onToggle={onToggle}
                                        treeData={data}
                                        setEditedId={setEditedId}
                                        handleRef={handleRef}
                                        getPipeHeight={getPipeHeight}
                                    />
                                )}
                                dragPreviewRender={(monitorProps) => (
                                    <CustomDragPreview monitorProps={monitorProps}/>
                                )}
                                onDrop={handleDrop}

                                classes={{
                                    root: styles.treeRoot,
                                    draggingSource: styles.draggingSource,
                                    placeholder: styles.placeholderContainer
                                }}
                                sort={false}
                                insertDroppableFirst={false}
                                enableAnimateExpand={true}

                                canDrop={(tree, {dragSource, dropTargetId, dropTarget}) => {
                                    if (dragSource?.parent === dropTargetId) {
                                        return true;
                                    }
                                }}
                                dropTargetOffset={10}
                                placeholderRender={(node, {depth}) => (
                                    <Placeholder node={node} depth={depth}/>
                                )}
                                initialOpen={true}
                            />
                        </DndProvider>
                    </Box>
                </Paper>
                <Fade in={edited}>
                    <Tooltip title={"Zapisz"}>
                        <IconButton
                            type="submit"
                            color="success"
                            size={"small"}
                            disabled={processing}
                            onClick={saveBasic}
                            sx={{
                                position: "absolute",
                                top: 20,
                                right: 15,
                            }}>
                            <Save fontSize={"large"}/>
                        </IconButton>
                    </Tooltip>

                </Fade>
                <Fade in={edited}>
                    <Tooltip title={"Cofnij zmiany"}>
                        <IconButton
                            color="error"
                            size={"small"}
                            disabled={processing}
                            onClick={resetForm}
                            sx={{
                                position: "absolute",
                                top: 20,
                                right: 65,
                            }}
                        >
                            <Cancel fontSize={"large"}/>
                        </IconButton>
                    </Tooltip>
                </Fade>
            </Grid>
            <Grid item xs={12} md={6} sx={{position: "relative"}}>
                <Paper sx={{height: 1, p: 1, pt: 2}}>
                    <Box>
                        <Typography variant={"h6"}>Edycja kategorii</Typography>
                        <Divider sx={{my: 1}}/>
                        <Box sx={{p: 2}}>
                            {/*<Typography variant={"h6"}>Nazwa</Typography>*/}
                            {/*<Typography>{data.find(e => e.id === 1).text}</Typography>*/}
                            <TextField id="name"
                                       label="Nazwa"
                                       variant="outlined"
                                       value={data.find(e => e.id === editedId) ? data.find(e => e.id === editedId)?.name : ""}
                                       onChange={(e) => {
                                           setData(data.map(d => {
                                               if (d.id === editedId) {
                                                   d.name = e.target.value;
                                                   d.text = e.target.value;
                                                   setEdited(true);
                                               }
                                               return d;
                                           }))

                                       }}
                            />

                        </Box>
                        <Box sx={{p: 2}}>
                            <Typography variant={"h6"}>Pokaż w menu</Typography>
                            <Checkbox
                                checked={Boolean(data.find(e => e.id === editedId)?.data?.show_in_menu)}
                                onChange={(e) => {
                                    setData(data.map(d => {
                                        if (d.id === editedId) {
                                            d.data.show_in_menu = e.target.checked;
                                            setEdited(true);
                                        }
                                        return d;
                                    }))
                                }}
                            />
                        </Box>
                    </Box>

                </Paper>
                <Fade in={edited}>
                    <Tooltip title={"Zapisz"}>
                        <IconButton
                            type="submit"
                            color="success"
                            size={"small"}
                            disabled={processing}
                            onClick={saveBasic}
                            sx={{
                                position: "absolute",
                                top: 20,
                                right: 15,
                            }}>
                            <Save fontSize={"large"}/>
                        </IconButton>
                    </Tooltip>

                </Fade>
                <Fade in={edited}>
                    <Tooltip title={"Cofnij zmiany"}>
                        <IconButton
                            color="error"
                            size={"small"}
                            disabled={processing}
                            onClick={resetForm}
                            sx={{
                                position: "absolute",
                                top: 20,
                                right: 65,
                            }}
                        >
                            <Cancel fontSize={"large"}/>
                        </IconButton>
                    </Tooltip>
                </Fade>
            </Grid>
        </Grid>

    );
}
