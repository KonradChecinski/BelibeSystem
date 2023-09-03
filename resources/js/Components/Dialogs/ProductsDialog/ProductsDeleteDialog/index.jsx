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

export default function ProductsDeleteDialog({open, setOpen, product, last, params}) {

    const {data, setData, delete: destroy, processing, errors, reset} = useForm({
        product: product.id,
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        destroy(route("system.products.delete", {product: product.id}),

            {
                preserveScroll: true,
                onSuccess: () => {
                    // deleteRow(product.id)
                    enqueueSnackbar(`Usunięto produkt ${product.id} - ${product.name}`, {variant: 'success'})
                    handleClose();
                },
                onError: errors => {
                    console.log(errors)
                    enqueueSnackbar(`Błąd przy usuwaniu produktu ${product.id} - ${product.name}`, {variant: 'error'})

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
                Usuwanie produktu
            </DialogTitle>
            <DialogContent>
                <DialogContentText>Chcesz usunąć id:{product.id} "{product.name}"</DialogContentText>
                {last ?
                    <>
                        <br/>
                        <DialogContentText sx={{
                            color: "error.main"
                        }}>
                            Jest to ostatni produkt z koloru.
                        </DialogContentText>
                        <DialogContentText sx={{
                            color: "error.main"
                        }}>
                            Usunięcie tego produktu spowoduje usunięcie całego koloru
                        </DialogContentText>
                    </>
                    : ""
                }
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
