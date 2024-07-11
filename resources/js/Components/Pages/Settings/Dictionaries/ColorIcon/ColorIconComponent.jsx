import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    Divider, Fab,
    Fade, FormControlLabel, FormGroup,
    Grid,
    IconButton,
    Paper, Stack, Switch,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {Add, Cancel, Delete, Edit, Save} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {router, useForm} from "@inertiajs/react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CategoryModelsTable from "@/Components/Table/Settings/CategoryModelsTable";
import {MuiColorInput} from "mui-color-input";
import DropzoneIconAdd
    from "@/Components/Pages/Settings/Dictionaries/ColorIcon/DropzoneIconsAdd";
import ColorIconsTable from "@/Components/Table/Settings/ColorIconsTable";


export default function ColorIconComponent(props) {

    const [edited, setEdited] = useState(false);
    const [editedId, setEditedId] = useState(null);
    const [created, setCreated] = useState(false)

    const theme = useTheme();
    const lgBreakpointDown = useMediaQuery(theme.breakpoints.down("lg"));

    const [data, setData2] = useState(JSON.parse(JSON.stringify(props.productColors.map(c => ({...c, files: []})))))


    const {
        data: dataUpdate,
        setData: setDataUpdate,
        processing: processingUpdate,
        post: postUpdate,
    } = useForm({
        id: null,
        name: "",
        type: 0,
        hex: "#000000",
    });

    const {
        data: dataAdd,
        setData: setDataAdd,
        post: postAdd,
        transform: transformAdd,
        processing: processingAdd
    } = useForm({
        id: null,
        name: "",
        type: 0,
        hex: "#000000",
    })

    useEffect(() => {
        const newCategories = props.productColors.filter(o => !data.find(e => e.id === o.id))
        const newCategories2 = props.productColors
        // const newData = data.slice()
        // setData([...newData, ...newCategories])
        setData2([...newCategories2])
        if (newCategories.length > 0) {
            setEditedId(newCategories[0].id)
        }
    }, [props.productColors])

    const resetForm = () => {
        setData2(JSON.parse(JSON.stringify(props.productColors))) //!!!!!
        setEdited(false)
        setEditedId(null)
    }


    const handleSave = () => {
        console.log(dataUpdate)
        postUpdate(route("system.settings.colorIcon.update"), {
            forceFormData: true,
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano kolor", {variant: 'success'})
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy zapisywaniu koloru", {variant: 'error'})
            },
            preserveScroll: true
        })
    }
    const handleDelete = (id) => {
        const color = data.find(e => e.id === id);
        if (data.find(e => e.id === editedId)?.colors_count > 0) {
            return
        }

        const newData = data.filter(e => e.id !== id);


        router.delete(route("system.settings.colorIcon.delete", {productColorIcon: color.id}), {
            onSuccess: params => {
                enqueueSnackbar("Usunięto kolor", {variant: 'success'})
                setData2(newData)
                setEditedId(null)
                setEdited(false);
                setDataUpdate({
                    id: null,
                    name: "",
                    type: 0,
                    hex: "#000000",
                })
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy usuwaniu koloru: " + params.error, {variant: 'error'})
            },
            preserveScroll: true
        })
    }
    const handleAdd = () => {
        console.log(dataAdd)
        postAdd(route("system.settings.colorIcon.create"), {
            onSuccess: params => {
                enqueueSnackbar("Dodano kolor", {variant: 'success'})
                setDataAdd({
                    id: null,
                    name: "",
                    type: 0,
                    hex: "#000000",
                })
                setCreated(false)
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy dodawaniu koloru: " + params.error, {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
        <Grid container columnSpacing={2} sx={{height: "100%"}}>
            <Grid item xs={12} lg={6} sx={{position: "relative", height: 1, mb: lgBreakpointDown ? 2 : 0}}>
                <Paper sx={{height: 1, p: 1}}>
                    <Box sx={{height: 1, display: "flex", flexDirection: "column"}}>
                        <Box sx={{
                            height: "content-fit",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1
                        }}>
                            <Typography variant={"h6"}>Kolory</Typography>
                        </Box>

                        <Divider sx={{mb: 1}}/>
                        <Box
                            sx={{
                                overflowY: "auto",
                                height: 1,
                            }}>


                            {
                                data.map((color, index) => {
                                    return (
                                        <Paper
                                            key={index}
                                            elevation={4}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                p: 1,
                                                my: 1,
                                                gap: 2,
                                                borderRadius: 1,
                                                boxShadow: 1,
                                                position: "relative"
                                            }}
                                        >
                                            <Box sx={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                gap: 2

                                            }}>
                                                {color.type === 1 ?
                                                    <Box
                                                        component={"img"}
                                                        src={route("colorIcons", {path: color.path})}
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: "100%",
                                                            border: 1
                                                        }}/>
                                                    :
                                                    <Box sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: "100%",
                                                        bgcolor: color.hex,
                                                        border: 1
                                                    }}/>
                                                }
                                                <Divider flexItem orientation={"vertical"}/>

                                                <Typography variant="h5">
                                                    {color.name}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <IconButton aria-label="edit" size={"small"}
                                                            onClick={() => {
                                                                setEditedId(color.id)
                                                                setCreated(false)
                                                                setDataUpdate({
                                                                    id: color.id,
                                                                    name: color.name,
                                                                    type: color.type,
                                                                    hex: color.hex,
                                                                })
                                                            }}>
                                                    <Edit/>
                                                </IconButton>
                                            </Box>

                                        </Paper>
                                    );
                                })
                            }
                        </Box>
                    </Box>
                    <Box sx={{position: "absolute", bottom: -5, right: -25, zIndex: 20}}>
                        <Fab color="primary" aria-label="add" onClick={() => {
                            setCreated(true)
                            setEditedId(null)
                            setEdited(false)
                            setDataUpdate(null)
                        }}>
                            <Add/>
                        </Fab>
                    </Box>
                </Paper>


            </Grid>
            <Grid item xs={12} lg={6} sx={{position: "relative", height: 1}}>
                <Paper sx={{height: 1, p: 1, pt: 2}}>
                    <Box sx={{
                        height: "content-fit",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Typography variant={"h6"}>
                            {created && "Dodanie koloru"}
                            {editedId ? "Edycja koloru " + editedId + " - " + data.find(e => e.id === editedId)?.name : ""}
                        </Typography>
                        <Box>
                            <Fade in={Boolean(created) || Boolean(edited)}>
                                <Tooltip title={"Zapisz"}>
                                    <IconButton
                                        type="submit"
                                        color="success"
                                        size={"small"}
                                        disabled={processingAdd || processingUpdate}
                                        onClick={() => {
                                            if (created) handleAdd()
                                            if (edited) handleSave()
                                        }}
                                    >
                                        <Save fontSize={"large"}/>
                                    </IconButton>
                                </Tooltip>


                            </Fade>
                            <Fade in={edited}>
                                <Tooltip title={"Cofnij zmiany"}>
                                    <IconButton
                                        color="error"
                                        size={"small"}
                                        disabled={processingUpdate}
                                        onClick={resetForm}
                                    >
                                        <Cancel fontSize={"large"}/>
                                    </IconButton>
                                </Tooltip>
                            </Fade>
                            <Fade in={Boolean(editedId)}>
                                <Tooltip
                                    title={data.find(e => e.id === editedId)?.colors_count > 0 ? "Nie można usunąć koloru z dopisanymi modelami" : "Usuń kolor"}>
                                    <IconButton
                                        color="warning"
                                        size={"small"}
                                        disabled={processingUpdate || data.find(e => e.id === editedId)?.colors_count > 0}
                                        onClick={() => handleDelete(editedId)}
                                    >
                                        <Delete fontSize={"large"}/>
                                    </IconButton>
                                </Tooltip>
                            </Fade>
                        </Box>

                    </Box>
                    <Divider sx={{my: 1}}/>
                    {created ?
                        (
                            <>
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{p: 2}}>
                                        <TextField id="name"
                                                   label="Nazwa koloru"
                                                   variant="outlined"
                                                   value={dataAdd.name}
                                                   onChange={(e) => {
                                                       setDataAdd("name", e.target.value)
                                                   }}
                                                   sx={{width: "40ch"}}
                                        />

                                    </Box>

                                    <Box sx={{p: 2}}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography>Kolor</Typography>
                                            <Switch inputProps={{'aria-label': 'design'}}
                                                    checked={false}
                                                    disabled={true}
                                            />
                                            <Typography>Druk</Typography>
                                        </Stack>
                                    </Box>
                                    <Box sx={{p: 2}}>

                                        <Box>
                                            <MuiColorInput isAlphaHidden={true} format="hex"
                                                           value={dataAdd.hex}
                                                           onChange={(color) => {
                                                               setDataAdd("hex", color)
                                                           }}
                                            />
                                        </Box>


                                    </Box>
                                </Box>
                            </>
                        )
                        :
                        (
                            <>


                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{p: 2}}>
                                        <TextField id="name"
                                                   label="Nazwa koloru"
                                                   variant="outlined"
                                                   value={dataUpdate.id ? dataUpdate?.name : ""}
                                                   onChange={(e) => {
                                                       setDataUpdate("name", e.target.value)
                                                       setEdited(true)
                                                   }}
                                                   disabled={Boolean(dataUpdate.id === null)}
                                                   sx={{width: "40ch"}}
                                        />

                                    </Box>

                                    <Box sx={{p: 2}}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography>Kolor</Typography>
                                            <Switch inputProps={{'aria-label': 'design'}}
                                                    checked={dataUpdate.id && dataUpdate.type !== null ? Boolean(dataUpdate.type) : false}
                                                    onChange={(e, value) => {
                                                        setDataUpdate("type", value ? 1 : 0)
                                                        setEdited(true)
                                                        // console.log(dataUpdate, dataUpdate === null)
                                                    }}
                                                    disabled={Boolean(dataUpdate.id === null)}
                                            />
                                            <Typography>Druk</Typography>
                                        </Stack>
                                    </Box>
                                    <Box sx={{p: 2}}>

                                        {dataUpdate === undefined || Boolean(dataUpdate.type) === true ?
                                            <Box>
                                                <DropzoneIconAdd props={props}
                                                                 editedId={editedId}
                                                                 setEdited={setEdited}
                                                                 data={dataUpdate}
                                                                 setData={(file) => {
                                                                     setDataUpdate(file)
                                                                     setEdited(true)
                                                                 }}
                                                                 disabled={dataUpdate === undefined || Boolean(dataUpdate.type) !== true}/>
                                            </Box>
                                            :
                                            <Box>
                                                <MuiColorInput isAlphaHidden={true} format="hex"
                                                               value={dataUpdate && dataUpdate.hex ? dataUpdate?.hex : "#000000"}
                                                               onChange={(color) => {
                                                                   setDataUpdate("hex", color)
                                                                   setEdited(true)

                                                               }}
                                                               disabled={data.find(e => e.id === editedId) === undefined || Boolean(data.find(e => e.id === editedId).type) !== false}
                                                />
                                            </Box>

                                        }


                                    </Box>
                                </Box>

                                <Box sx={{my: 1}}>
                                    <ColorIconsTable
                                        colors={editedId ? data.find(e => e.id === editedId)?.colors_with_models : []}
                                        props={props}/>
                                </Box>

                            </>
                        )
                    }


                </Paper>


            </Grid>
        </Grid>

    );
}
