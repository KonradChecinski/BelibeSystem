import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper,
} from "@mui/material";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function DeleteLocationDialog({open, setOpen, type, clickedLocation, locations}) {

    const {data, setData, delete: destroy, patch, processing, errors, clearErrors, reset} = useForm({
        name: clickedLocation.name
    })
    const handleClose = () => {
        setOpen(false);
    };

    function deleteLocation(data, id) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            // Jeśli obiekt o podanym id znajduje się na najwyższym poziomie
            if (item.id === id) {
                data.splice(i, 1);
                return true;
            }

            // Jeśli obiekt ma dzieci, przeszukaj je rekurencyjnie
            if (item.children && Array.isArray(item.children)) {
                const found = deleteLocation(item.children, id);
                if (found) {
                    return true;
                }
            }
        }

        return false; // Jeśli obiekt nie został znaleziony
    }

    const title = () => {
        switch (type) {
            case "room":
                return "Usuwanie Pomieszczenia";
            case "aisle":
                return "Usuwanie Przejścia";
            case "shelf":
                return "Usuwanie Regału";
        }
    }

    const path = () => {
        switch (type) {
            case "room":
                return "system.settings.warehouseLocation.room.delete";
            case "aisle":
                return "system.settings.warehouseLocation.aisle.delete";
            case "shelf":
                return "system.settings.warehouseLocation.shelf.delete";
        }
    }


    const save = () => {
        destroy(route(path(), {warehouseLocation: clickedLocation.id.split('-')[1]}),
            {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar('Usunięto lokalizacje', {variant: 'success'})
                    handleClose();
                    deleteLocation(locations, clickedLocation.id)
                },
                onError: errors => {
                    enqueueSnackbar('Błąd przy usuwaniu lokalizacji', {variant: 'error'})
                    console.error(errors)
                    if (errors) {
                        Object.keys(errors).forEach(key => {
                            enqueueSnackbar(errors[key], {variant: 'error'})
                        });
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
                {title()}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>Chcesz usunąć
                    id:{clickedLocation.id} "{clickedLocation.name}"</DialogContentText>

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
