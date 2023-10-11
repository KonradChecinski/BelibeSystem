import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper,
} from "@mui/material";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";

export default function GroupsDeleteDialog({open, setOpen, reloadData, group, params}) {

    const {data, setData, delete: destroy, processing, errors, reset} = useForm({
        group: group.id,
    })

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        destroy(route("system.settings.group") + "/" + data.group,

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
                Usuwanie grupy
            </DialogTitle>
            <DialogContent>
                <DialogContentText>Chcesz usunąć id:{group.id} "{group.name}"</DialogContentText>

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
