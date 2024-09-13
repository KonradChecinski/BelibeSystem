import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper,
} from "@mui/material";
import Draggable from "react-draggable";
import {router} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";


export default function AcceptDialog({open, setOpen, warehouseDocument, props}) {

    const acceptDocument = (createInvoice) => {
        router.post(
            route("system.warehouse.document.accept", {warehouseDocument: warehouseDocument.id}),
            {
                create_invoice: createInvoice
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar("Dokument został zatwierdzony", {variant: "success"});
                },
                onError: (error) => {
                    enqueueSnackbar("Błąd zatwierdzania dokumentu", {variant: "error"});
                    console.log(error)
                }
            }
        )
    }


    return (


        <Dialog
            open={open}
            onClose={setOpen}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
        >
            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                Potwierdzenie DM
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Czy chcesz zatwierdzić dokument magazynowy {warehouseDocument.number}?
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                    Zamówienie zostanie przekazane do subiekta.
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                    Możesz utworzyć automatycznie do zamówienia fakturę
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant={"outlined"} onClick={setOpen}>Nie</Button>
                <Button variant={"contained"} onClick={() => acceptDocument(false)}>Tak, bez
                    faktury</Button>
                <Button variant={"contained"} color={"info"} autoFocus
                        onClick={() => acceptDocument(true)}>Tak, z
                    fakturą</Button>
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
