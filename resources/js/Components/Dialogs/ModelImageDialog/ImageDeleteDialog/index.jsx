import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField
} from "@mui/material";
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useState, useRef} from "react";
import Draggable from "react-draggable";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function ImagesDeleteDialog({open, setOpen, image, params}) {

    const {delete: remove, processing} = useForm()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        console.log(image)
        remove(route("system.products.images.delete", {image: image.id}),

            {
                preserveScroll: true,
                onSuccess: (e) => {

                    enqueueSnackbar("Usunięto zdjęcie", {variant: 'success'})
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy usuwaniu zdjęć", {variant: 'error'})
                    console.error(errors)
                },
            })


    }


    return (

        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
        >

            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                Usuwanie zdjęcia
            </DialogTitle>
            <DialogContent>
                <DialogContentText>Chcesz usunąć id:{image.id}</DialogContentText>
                <img src={route("images", {path: image.path})} alt={"Usuwane zdjęcie"} className={"h-48"}/>

            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Zamknij
                </Button>


                <Button onClick={save} disabled={processing}>
                    Usuń
                </Button>
            </DialogActions>

        </Dialog>

    );
}


function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}
