import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper,} from "@mui/material";
import Draggable from "react-draggable";
import {router, usePage} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";


export default function AcceptDialog({open, setOpen, warehouseDocument, processing, props, auth: propAuth}) {
    const pageAuth = usePage()?.props?.auth;
    const auth = propAuth || props?.auth || pageAuth;
    const [openShipmentModal, setOpenShipmentModal] = useState(false);

    console.log(warehouseDocument);
    const handleClose = () => {
        if (typeof setOpen === "function") {
            setOpen(false);
        }
    };

    const acceptDocument = (type) => {
        if (!warehouseDocument?.id) return;

        router.post(
            route("system.warehouse.document.accept", {warehouseDocument: warehouseDocument.id}),
            {
                create_type: type
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar("Dokument został zatwierdzony", {variant: "success"});
                    handleClose();
                    if (auth?.permissions?.includes("createShipments")) {
                        setOpenShipmentModal(true);
                    }
                },
                onError: (error) => {
                    enqueueSnackbar("Błąd zatwierdzania dokumentu", {variant: "error"});
                    for (const key in error) {
                        enqueueSnackbar(error[key], {variant: "error"});
                    }
                    console.log(error);
                    // handleClose();
                }
            }
        );
    };

    const handleCloseShipmentModal = () => {
        setOpenShipmentModal(false);
    };

    const handleConfirmShipment = () => {
        setOpenShipmentModal(false);
        router.visit(route("system.shipments"));
    };

    return (
        <>
            <Dialog
                open={Boolean(open)}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                scroll="paper"
            >
                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    Potwierdzenie DM
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Czy chcesz zatwierdzić dokument magazynowy {warehouseDocument?.number}?
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        Zamówienie zostanie przekazane do subiekta.
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" sx={{mt: 2, fontWeight: "bold"}}>
                        {/*Możesz utworzyć automatycznie do zamówienia fakturę*/}
                        Wybierz w jakiej postaci zostanie przekazane zamówienie do subiekta.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant={"outlined"} onClick={handleClose}>Nie</Button>

                    <Button
                        variant={"contained"}
                        onClick={() => acceptDocument(0)}>
                        Jako zamówienie
                    </Button>

                    <Button
                        variant={"contained"}
                        color={"success"}
                        onClick={() => acceptDocument(1)}
                        autoFocus>
                        Jako fakturę
                    </Button>

                    {warehouseDocument?.client_order?.client?.partner && (
                        <Button
                            variant={"contained"}
                            color={"info"}
                            onClick={() => acceptDocument(2)}>
                            Jako MM
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog
                open={openShipmentModal}
                onClose={handleCloseShipmentModal}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-shipment-dialog-title"
                scroll="paper"
            >
                <DialogTitle style={{cursor: 'move'}} id="draggable-shipment-dialog-title">
                    Tworzenie przesyłki
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy chcesz utworzyć przesyłkę?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant={"outlined"} onClick={handleCloseShipmentModal}>
                        Nie
                    </Button>
                    <Button variant={"contained"} color={"primary"} autoFocus onClick={handleConfirmShipment}>
                        Tak
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title, #draggable-shipment-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}
