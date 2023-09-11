import {DropzoneArea, DropzoneAreaBase, DropzoneDialog} from "mui-file-dropzone";
import Button from "@mui/material/Button";
import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import ReactDraggable from "react-draggable";
import {
    Autocomplete, Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, Grid,
    Paper, Stack,
    TextField
} from "@mui/material";

export default function DropzoneImagesAddDialog({open, setOpen, props}) {

    const {data, setData, post, processing, errors, clearErrors, reset} = useForm({
        model_color: null,
        type: null,
        files: []
    })


    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = (files) => {
        console.log(data)

        post(route("system.products.images.create", {modelColor: data.model_color.id}),

            {
                preserveScroll: true,
                onSuccess: (e) => {

                    reset();
                    enqueueSnackbar("Dodano zdjęcia", {variant: 'success'})
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy dodawniu zdjęć", {variant: 'error'})
                    console.error(errors)
                },
            })
    }

    const changeDataFiles = (files) => {
        setData("files", files)
    }

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            fullWidth
            maxWidth={"md"}
        >
            <DialogTitle style={{cursor: "move"}} id="draggable-dialog-title">
                Dodawanie zdjęcia
            </DialogTitle>
            <DialogContent>

                <Stack
                    my={1}
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem/>}
                    spacing={2}
                >
                    <Autocomplete
                        id="color"
                        options={props.productModel.colors_with_images.map(e => ({
                            id: e.id,
                            shortcut: e.shortcut,
                            label: e.shortcut + " - " + e.name
                        }))}
                        sx={{width: "30ch"}}
                        value={data.color}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(e, value) => {
                            setData("model_color", value)
                        }}
                        renderInput={(params) => <TextField {...params} label="Kolor" sx={{my: 1}}/>}
                    />
                    <Autocomplete
                        id="type"
                        options={[
                            {id: '1', label: 'Normalne'},
                            {id: '1', label: 'Duże'},
                            {id: '1', label: 'Archiwalne'}
                        ]}
                        sx={{width: "30ch"}}
                        value={data.type}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(e, value) => {
                            setData("type", value)
                        }}
                        renderInput={(params) => <TextField {...params} label="Typ" sx={{my: 1}}/>}
                    />

                </Stack>


                <DropzoneArea
                    acceptedFiles={["image/jpeg", "image/png"]}
                    showPreviews={true}
                    maxFileSize={31457280}
                    filesLimit={10}
                    showAlerts={null}
                    onAlert={(text, type) => {
                    }}
                    onChange={changeDataFiles}
                    clearOnUnmount={false}
                    previewText={"Podgląd"}
                    showPreviewsInDropzone={false}
                    showFileNamesInPreview={false}
                    getFileRemovedMessage={(e) => enqueueSnackbar("Usunięto " + e + "", {variant: "default"})}
                    getDropRejectMessage={(e) => enqueueSnackbar("Plik " + e.name + " jest niedozwolonego typu", {variant: "warning"})}
                    getFileAddedMessage={(e) => enqueueSnackbar("Dodano " + e, {variant: "info"})}
                    getFileLimitExceedMessage={(e) => enqueueSnackbar("Przekroczono ilość dozwolonych zdjęć w pojedyńczym przesłaniu: " + e, {variant: "error"})}
                    dropzoneText={"Przeciągnij plik lub kliknij tutaj"}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Zamknij
                </Button>
                <Button autoFocus onClick={handleSave}>
                    Wyślij
                </Button>
            </DialogActions>
        </Dialog>
    );

}


function PaperComponent(props) {
    return (
        <ReactDraggable
            handle="#draggable-dialog-title"
            cancel={"[class*=\"MuiDialogContent-root\"]"}
        >
            <Paper {...props} />
        </ReactDraggable>
    );
}
