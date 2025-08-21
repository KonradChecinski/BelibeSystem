import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper,
} from "@mui/material";
import Draggable from "react-draggable";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function ModelDeleteLocationDialog({open, setOpen, productModel_id, shelf}) {

    const {delete: destroy, processing, errors} = useForm();

    const handleClose = () => {
        setOpen(null);
    };


    const save = () => {
        destroy(route("system.products.model.warehouse.delete", {
            productModel: productModel_id,
            warehouseLocation: shelf.id
        }), {
            preserveScroll: true,
            onSuccess: () => {
                enqueueSnackbar("Półka została usunięta z produktu", {variant: 'success'});
                setOpen(null);
            },
            onError: (error) => {
                console.error(error);
                enqueueSnackbar("Błąd podczas usuwania półki z produktu", {variant: 'error'});
                for (const errorsKey in errors) {
                    enqueueSnackbar(errors[errorsKey], {variant: 'error'})
                }
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
                Usuwanie lokalizacji z modelu
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Chcesz usunąć lokalizację magazynową id:{shelf?.id}
                    <br/>
                    {shelf?.room?.name} > {shelf?.aisle?.name} > {shelf?.name}
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
