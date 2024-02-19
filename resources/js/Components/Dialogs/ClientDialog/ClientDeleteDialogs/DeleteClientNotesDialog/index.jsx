import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper,
} from "@mui/material";
import Draggable from "react-draggable";
import moment from "moment";
import {useForm} from "@inertiajs/react";

export default function DeleteClientNotesDialog({open, setOpen, note, last, params}) {

    // const {data, setData, delete: destroy, processing, errors, reset} = useForm({
    //     task: task.id,
    // })

    let date = moment(note.created_at)

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        // console.log(task)
        // destroy(route("system.clients.client.task.delete", {client: params.client.id, clientTask: task}),
        //
        //     {
        //         preserveScroll: true,
        //         onSuccess: () => {
        //             enqueueSnackbar(`Usunięto zadanie ${task.id} - ${task.title}`, {variant: 'success'})
        //             handleClose();
        //         },
        //         onError: errors => {
        //             enqueueSnackbar(`Błąd przy usuwaniu zadania ${task.id} - ${task.title}`, {variant: 'error'})
        //             console.error(errors)
        //         }
        //     })
        //

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
                Usuwanie notatki klienta
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Chcesz usunąć id:{note.id} "{note.user.name} - {date.format("YYYY-MM-DD H:m:s")}"
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Zamknij
                </Button>


                <Button onClick={save}>
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
