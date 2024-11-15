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
    Divider, Fab,
    Fade, FormControlLabel, FormGroup,
    Grid,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import useTreeOpenHandler
    from "@/Components/Pages/Settings/Dictionaries/Category/TreeViewComponent/Components/useTreeOpenHandler";
import {Add, Cancel, Delete, Edit, Save} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {router, useForm} from "@inertiajs/react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CategoryModelsTable from "@/Components/Table/Settings/CategoryModelsTable";
import CategoryClientsTable from "@/Components/Table/Settings/CategoryClientsTable";

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

    const theme = useTheme();
    const lgBreakpointDown = useMediaQuery(theme.breakpoints.down("lg"));

    const {data, setData, processing, put, transform} = useForm(props.categories.map(e => (
        {
            ...e,
            droppable: true,
            text: e.name,
            data: {
                show_in_menu: e.show_in_menu,
            }
        }
    )));

    const {data: dataAdd, setData: setDataAdd, post} = useForm({
        id: null,
        parent: 0,
        name: "Brak nazwy",
        show_in_menu: false,
        order: 1000,
    })

    useEffect(() => {
        const newCategories = props.categories.filter(o => !data.find(e => e.id === o.id)).map(e => (
            {
                ...e,
                droppable: true,
                text: e.name,
                data: {
                    show_in_menu: e.show_in_menu,
                }
            }
        ))
        const newData = data.slice()
        const newSlugs = props.categories.filter(o => data.find(e => e.id === o.id && e.slug !== o.slug))
        newSlugs.forEach(e => {
            newData.find(d => d.id === e.id).slug = e.slug
        })
        setData([...newData, ...newCategories])
        if (newCategories.length > 0) {
            setEditedId(newCategories[0].id)
        }
    }, [props.categories])

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
        setEdited(false)
        setEditedId(null)
    }

    transform((data) =>
        data.map(e => ({
            id: e.id,
            name: e.name === "" ? "Brak nazwy" : e.name,
            parent: e.parent,
            slug: e.slug,
            show_in_menu: e.show_in_menu,
            order: e.order,
        }))
    );

    const handleSave = () => {
        put(route("system.settings.category.update"), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano kategorie", {variant: 'success'})
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy zapisywaniu kotegorii", {variant: 'error'})
            },
            preserveScroll: true
        })
    }
    const handleDelete = (id) => {
        const node = data.find(e => e.id === id);
        const descendants = getDescendants(data, node.id);
        if (descendants.length > 0) {
            return
        }

        const newTree = data.filter(e => e.id !== id);


        router.delete(route("system.settings.category.delete", {productCategory: node.id}), {
            onSuccess: params => {
                enqueueSnackbar("Usunięto kategorię", {variant: 'success'})
                setData(newTree)
                setEditedId(null)
                setEdited(false);
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy usuwaniu kategorii: " + params.error, {variant: 'error'})
            },
            preserveScroll: true
        })
    }
    const handleAdd = () => {
        post(route("system.settings.category.create"), {
            onSuccess: params => {
                enqueueSnackbar("Dodano kategorię", {variant: 'success'})
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy dodawaniu kategorii: " + params.error, {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    const handleDrop = (newTreeData, dnd, f) => {
        let treeData = newTreeData.slice();
        treeData = sortTreeData(treeData);
        setData(treeData)
        setEdited(true);
        ref.current?.openAll();
        ref.current?.openAll();
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


    return (
        <Grid container columnSpacing={2} sx={{height: "100%"}}>
            <Grid item xs={12} lg={6} sx={{position: "relative", mb: lgBreakpointDown ? 2 : 0}}>
                <Paper sx={{height: 1, p: 1}}>
                    <Box
                        sx={{
                            overflowY: "auto",
                            height: 1,
                        }}>
                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant={"h6"}>Kolejność kategorii</Typography>
                            <Box>
                                <Fade in={edited}>
                                    <Tooltip title={"Cofnij zmiany"}>
                                        <IconButton
                                            color="error"
                                            size={"small"}
                                            disabled={processing}
                                            onClick={resetForm}
                                        >
                                            <Cancel fontSize={"large"}/>
                                        </IconButton>
                                    </Tooltip>
                                </Fade>
                                <Fade in={edited}>
                                    <Tooltip title={"Zapisz"}>
                                        <IconButton
                                            type="submit"
                                            color="success"
                                            size={"small"}
                                            disabled={processing}
                                            onClick={handleSave}
                                        >
                                            <Save fontSize={"large"}/>
                                        </IconButton>
                                    </Tooltip>

                                </Fade>

                            </Box>
                        </Box>

                        <Divider sx={{mb: 1}}/>
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
                    <Box sx={{position: "absolute", bottom: -5, right: -5, zIndex: 20}}>
                        <Fab color="primary" aria-label="add" onClick={handleAdd}>
                            <Add/>
                        </Fab>
                    </Box>
                </Paper>


            </Grid>
            <Grid item xs={12} lg={6} sx={{position: "relative"}}>
                <Paper sx={{height: 1, p: 1, pt: 2}}>
                    <Box>
                        <Typography variant={"h6"}>Edycja
                            kategorii {editedId ? editedId + " - " + data.find(e => e.id === editedId)?.name : ""} </Typography>
                        <Divider sx={{my: 1}}/>
                        <Box sx={{display: "flex"}}>
                            <Box sx={{p: 2}}>
                                <TextField id="name"
                                           label="Nazwa kategorii"
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
                                <TextField id="slug"
                                           label="Url"
                                           variant="outlined"
                                           value={data.find(e => e.id === editedId) ? data.find(e => e.id === editedId)?.slug : ""}
                                           onChange={(e) => {
                                               setData(data.map(d => {
                                                   if (d.id === editedId) {
                                                       d.slug = e.target.value;
                                                       setEdited(true);
                                                   }
                                                   return d;
                                               }))

                                           }}
                                />

                            </Box>
                            <Box sx={{p: 2}}>
                                <Typography variant={"h6"}></Typography>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={Boolean(data.find(e => e.id === editedId)?.data?.show_in_menu)}
                                                onChange={(e) => {
                                                    setData(data.map(d => {
                                                        if (d.id === editedId) {
                                                            d.data.show_in_menu = e.target.checked;
                                                            d.show_in_menu = e.target.checked;
                                                            setEdited(true);
                                                        }
                                                        return d;
                                                    }))
                                                }}
                                                sx={{'& .MuiSvgIcon-root': {fontSize: 28}}}
                                            />
                                        }
                                        label="Pokaż w menu"/>
                                </FormGroup>

                            </Box>
                        </Box>

                        <Box sx={{my: 1}}>
                            <CategoryModelsTable
                                models={editedId ? data.find(e => e.id === editedId)?.product_models : []}
                                props={props}/>
                        </Box>
                        <Box sx={{my: 1}}>
                            <CategoryClientsTable
                                clients={editedId ? data.find(e => e.id === editedId)?.clients_discounts : []}
                                props={props}/>
                        </Box>
                    </Box>

                </Paper>
                <Fade in={Boolean(editedId)}>
                    <Tooltip
                        title={getDescendants(data, editedId).length > 0 ? "Nie można usunąć kategorii z podkategoriami" : "Usuń kategorię"}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: 50,
                                right: 30,
                            }}>
                            <IconButton
                                color="warning"
                                size={"small"}
                                disabled={processing || getDescendants(data, editedId).length > 0}
                                onClick={() => handleDelete(editedId)}
                            >
                                <Delete fontSize={"large"}/>
                            </IconButton>
                        </Box>

                    </Tooltip>
                </Fade>

            </Grid>
        </Grid>

    );
}
