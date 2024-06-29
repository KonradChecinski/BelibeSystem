import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper, Typography,
} from "@mui/material";
import Draggable from "react-draggable";
import moment from "moment";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function AgainOrderDialog({open, setOpen, row, params}) {

    const {data, setData, post, processing, errors, reset} = useForm()

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        post(
            route("b2b.order.again", {clientOrder: row.original.id}),
            {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar(`Dodano do koszyka produkty z zamówienia - ${row.original.number}`, {variant: 'success'})
                    handleClose();

                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar(`Błąd przy dodawaniu do koszyka produktów z zamówienia - ${row.original.number}`, {variant: 'error'})
                }
            }
        )

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
                Dodawanie do koszyka produkty z zamówienia - {row.original.number}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography variant="body1" gutterBottom>
                        Czy na pewno chcesz dodać do koszyka produkty z zamówienia - {row.original.number}?
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Spowoduje to wyczyszczenie dotychczasowego koszyka.
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Zamknij
                </Button>


                <Button onClick={save} disabled={processing}>
                    Tak
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
