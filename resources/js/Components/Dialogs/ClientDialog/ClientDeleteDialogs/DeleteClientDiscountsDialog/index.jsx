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

export default function DeleteClientDiscountsDialog({open, setOpen, discount, last, params}) {

    const {data, setData, delete: destroy, processing, errors, reset} = useForm({
        discount: discount.id,
    })

    const handleClose = () => {
        setOpen(false);
    };

    let type = '';
    switch (discount.value) {
        case 1:
            type = 'Model';
            break;
        case 2:
            type = 'Kategoria';
            break;
        case 3:
            type = 'Grupa';
            break;
        case 4:
            type = 'Producent';
            break;
    }

    let name = '';
    switch (discount.type) {
        case 1:
            name = discount.product_model.symbol + " - " + discount.product_model.name
            break;
        case 2:
            name = discount.product_category.name
            break;
        case 3:
            name = discount.product_group.name
            break;
        case 4:
            name = discount.product_brand.name
            break;
    }

    const save = () => {
        destroy(route("system.clients.client.discount.delete", {clientDiscount: discount}),

            {
                preserveScroll: true,
                onSuccess: () => {
                    // deleteRow(product.id)
                    enqueueSnackbar(`Usunięto rabat ${type} - ${name}`, {variant: 'success'})
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar(`Błąd przy usuwaniu rabatu ${type} - ${name}`, {variant: 'error'})
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
                Usuwanie rabatu klienta
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Chcesz usunąć id:{discount.id} "{type} - {name} - {discount.value}%"
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
