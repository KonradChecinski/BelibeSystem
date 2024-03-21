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

export default function ModelsDeleteDialog({open, setOpen, reloadData, model, params}) {

    const {data, setData, delete: destroy, processing, errors, reset} = useForm({
        model: model.id,
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        destroy(route("system.products.models.delete", {productModel: data.model}),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reloadData();
                    handleClose();
                },
                onError: errors => {
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
                Usuwanie Roli systemowej
            </DialogTitle>
            <DialogContent>
                <DialogContentText>Chcesz usunąć id:{model.id} "{model.symbol}"</DialogContentText>

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
