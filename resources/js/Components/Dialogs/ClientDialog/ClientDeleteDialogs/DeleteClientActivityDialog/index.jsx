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

export default function DeleteClientActivityDialog({open, setOpen, activity, last, params}) {

    const {data, setData, delete: destroy, processing, errors, reset} = useForm({
        activity: activity.id,
    })

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        // destroy(route("system.products.delete", {product: product.id}),
        //
        //     {
        //         preserveScroll: true,
        //         onSuccess: () => {
        //             // deleteRow(product.id)
        //             enqueueSnackbar(`Usunięto produkt ${product.id} - ${product.name}`, {variant: 'success'})
        //             handleClose();
        //         },
        //         onError: errors => {
        //             enqueueSnackbar(`Błąd przy usuwaniu produktu ${product.id} - ${product.name}`, {variant: 'error'})
        //             console.error(errors)
        //         }
        //     })


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
                Usuwanie aktywności klienta
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Chcesz usunąć id:{activity.id} "{activity.activity_type.name} - {activity.description}"
                </DialogContentText>
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
