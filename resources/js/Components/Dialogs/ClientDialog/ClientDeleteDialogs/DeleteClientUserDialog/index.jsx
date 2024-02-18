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

export default function DeleteClientUserDialog({open, setOpen, user, last, params}) {

    const {data, setData, delete: destroy, processing, errors, reset} = useForm({
        user: user.id,
    })

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        destroy(route("system.clients.client.user.delete", {client: params.client.id, clientUser: user}),

            {
                preserveScroll: true,
                onSuccess: () => {
                    // deleteRow(product.id)
                    enqueueSnackbar(`Usunięto użytkownika klienta ${user.id} - ${user.name}`, {variant: 'success'})
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar(`Błąd przy usuwaniu użytkownika klienta ${user.id} - ${user.name}`, {variant: 'error'})
                    console.error(errors)
                }
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
                Usuwanie użytkownika klienta
            </DialogTitle>
            <DialogContent>
                <DialogContentText>Chcesz usunąć id:{user.id} "{user.name}"</DialogContentText>
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
