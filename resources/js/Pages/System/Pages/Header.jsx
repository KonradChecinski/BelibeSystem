import {Head, Link, router, useForm} from "@inertiajs/react";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    Divider, Fade,
    IconButton,
    List,
    ListItem,
    ListItemIcon, ListItemText, Paper,
    TextField,
    Tooltip, Typography
} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import UserLayout from "@/Layouts/UserLayout";
import {Add, Cancel, Delete, DragIndicator, Save} from "@mui/icons-material";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import React, {useState} from "react";
import {enqueueSnackbar} from "notistack";

export default function Header(props) {
    const {t} = useLaravelReactI18n();
    const {data, setData, patch, errors, processing} = useForm({
        header: props.dynamicHeader
    });
    const [value, setValue] = useState()
    const [edited, setEdited] = useState(false)


    let tempLinks = [];
    for (const group of props.links) {
        for (const link of group.links) {
            tempLinks.push({
                label: link.name,
                url: link.url,
                group: group.name
            })
        }
    }

    const [links, setLinks] = useState(tempLinks);
    console.log(links)

    const onDragEnd = (e) => {
        if (!e.destination) return;
        if (e.source.droppableId === e.destination.droppableId && e.source.index === e.destination.index) return;

        const newArray = [...data.header]

        //Source
        const sourceIndex = e.source.index

        //Destination
        const destinationIndex = e.destination.index

        const dropElement = newArray.splice(sourceIndex, 1)[0]
        newArray.splice(destinationIndex, 0, dropElement)
        setData("header", newArray)
        setEdited(true)
    };

    const addLink = () => {
        if (value && data.header.length < 6) {
            setData("header", [
                ...data.header,
                {
                    url: value.url,
                    name: value.label
                }
            ])
            setValue(null)
            setEdited(true)
        }
    }

    const deleteLink = (url) => {
        setData("header", data.header.filter((row) => (row.url !== url)))
        setEdited(true)
    }

    const resetForm = () => {
        setData("header", props.dynamicHeader)
    }

    const save = () => {

        console.log(data)
        patch(route('system.pages.header.update'),
            {
                preserveScroll: true,
                onSuccess: (e) => {
                    enqueueSnackbar("Zapisano linki w nagłówku", {variant: 'success'})
                    setEdited(false)
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy zapisywaniu nagłówku", {variant: 'error'})
                    console.error(errors)
                },
            })
    }
    console.log(data)

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={t("Header")}
        >
            <Head title={t("Header")}/>
            <Card sx={{height: "100%", width: 1}}>
                <Box sx={{display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", p: 1}}>
                    <Typography variant="h5">
                        Dodaj linki do nagłówka
                    </Typography>
                    <Box sx={{display: "flex", gap: 2}}>
                        <Fade in={edited}>
                            <Tooltip title={"Zapisz"}>
                                <IconButton
                                    type="submit"
                                    color="success"
                                    size={"small"}
                                    disabled={processing}
                                    onClick={save}
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
                                    disabled={processing}
                                    onClick={resetForm}
                                >
                                    <Cancel fontSize={"large"}/>
                                </IconButton>
                            </Tooltip>
                        </Fade>
                    </Box>
                </Box>
                <Divider/>
                <Box sx={{display: "flex", gap: 2, alignItems: "center", p: 1}}>
                    <Autocomplete
                        id="type"
                        options={links}
                        sx={{width: "60ch"}}
                        value={value}
                        groupBy={(option) => option.group}
                        isOptionEqualToValue={(option, value) => option.url === value.url}
                        onChange={(e, value) => setValue(value)}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Link"
                                sx={{my: 1}}
                                value={value}
                            />
                        }
                        renderGroup={(params) => (
                            <li key={params.key}>
                                <Box sx={{bgcolor: "#00000055", p: 1, color: "#fff"}}>
                                    <Typography variant="body1">
                                        {t(params.group)}
                                    </Typography>
                                </Box>
                                <ul>{params.children}</ul>
                            </li>
                        )}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.link}>
                                    {option.label}
                                </li>
                            );
                        }}
                    />
                    <Button variant="outlined" startIcon={<Add/>} onClick={addLink}
                            disabled={!Boolean(value) || data.header.length >= 6}>
                        Dodaj
                    </Button>


                </Box>
                <Divider/>
                <Box>
                    <Box sx={{
                        minHeight: 50,
                        borderRadius: 1,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        width: "60ch",
                        overflow: "hidden"
                    }}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="links">
                                {provided => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            width: "60ch",
                                        }}
                                    >
                                        <List>
                                            {data.header.map((item, index) => (
                                                <Draggable
                                                    draggableId={"link_" + item.url}//do zmiany na id
                                                    index={index}
                                                    key={item.url}//do zmiany na id
                                                    sx={{height: "50px"}}
                                                >
                                                    {(provided, snapshot) => {
                                                        return (

                                                            <ListItem
                                                                component={Paper}
                                                                elevation={4}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                sx={{
                                                                    my: 1,
                                                                    top: "auto !important",
                                                                    left: "auto !important",
                                                                    bgcolor: snapshot.isDragging ? "rgba(0,0,0,0.3)" : "",
                                                                }}
                                                                secondaryAction={
                                                                    <IconButton edge="end" aria-label="delete"
                                                                                onClick={() => deleteLink(item.url)}>
                                                                        <Delete/>
                                                                    </IconButton>
                                                                }
                                                            >
                                                                {/*<Paper elevation={4} sx={{width: 1}}>*/}
                                                                <ListItemIcon>
                                                                    <DragIndicator/>
                                                                </ListItemIcon>
                                                                <ListItemText primary={item.name}/>
                                                                {/*</Paper>*/}
                                                            </ListItem>

                                                        )
                                                    }

                                                    }

                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </List>
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Box>
                </Box>
            </Card>

        </UserLayout>
    );
}
