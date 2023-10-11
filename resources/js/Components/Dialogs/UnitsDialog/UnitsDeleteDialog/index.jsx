import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper,
} from "@mui/material";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";

export default function UnitsDeleteDialog({open, setOpen, reloadData, unit, params}) {

    const {data, setData, delete: destroy, processing, errors, reset} = useForm({
        unit: unit.id,
    })

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        destroy(route("system.settings.unit") + "/" + data.unit,

            {
                preserveScroll: true,
                onSuccess: () => {
                    reloadData();
                    handleClose();
                },
                onError: errors => {
                    console.log(errors)
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
                Usuwanie jednostki
            </DialogTitle>
            <DialogContent>
                <DialogContentText>Chcesz usunąć id:{unit.id} "{unit.name}"</DialogContentText>

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
