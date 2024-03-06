import {useEffect, useState} from "react";
import {
    Box, Button,
    Card, CardActions,
    CardContent,
    Divider,
    Fab,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import moment from "moment";
import DeleteClientNotesDialog from "@/Components/Dialogs/ClientDialog/ClientDeleteDialogs/DeleteClientNotesDialog";
import ClientAddEditNotesDialog from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditNotesDialog";

export default function ClientNotes({notes, readOnly, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(notes.map((note) => ({id: note.id, value: false})));
    const [openDialogEdit, setOpenDialogEdit] = useState(notes.map((note) => ({id: note.id, value: false})));

    useEffect(() => {
        setOpenDialogDelete(notes.map((note) => ({id: note.id, value: false})))
        setOpenDialogEdit(notes.map((note) => ({id: note.id, value: false})))
    }, [props])
    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, mb: 3}}>
                {notes.map((note) => {

                    const onEditClick = (e) => {
                        // setOpenDialogAdd(true)
                        let object = openDialogEdit.find(e => e.id === note.id)
                        object.value = !object.value

                        setOpenDialogEdit([...openDialogEdit, object])
                    };

                    const onDeleteClick = (e) => {
                        // setOpenDialogDelete(true);

                        let object = openDialogDelete.find(e => e.id === note.id)
                        object.value = !object.value

                        setOpenDialogDelete([...openDialogDelete, object])
                    };
                    return (
                        <Box key={note.id}>
                            <Card variant="outlined"

                                  sx={{
                                      position: "relative",
                                      px: 1
                                  }}>
                                <CardContent>
                                    <Typography sx={{
                                        mb: 1,
                                        fontSize: "11px"
                                    }}>
                                        {note.text}
                                    </Typography>
                                    <Divider variant="middle"/>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        gap: 1,
                                        mt: 1
                                    }}>
                                        <Typography sx={{fontSize: "10px"}}>
                                            {note.user.name}
                                        </Typography>
                                        <Divider orientation="vertical" flexItem/>
                                        <Tooltip title="Dodano" arrow>
                                            <Typography sx={{fontSize: "10px"}}>
                                                {moment(note.created_at).format("DD-MM-YYYY HH:mm")}
                                            </Typography>
                                        </Tooltip>


                                    </Box>

                                </CardContent>
                                <CardActions disableSpacing
                                             sx={{
                                                 position: "absolute",
                                                 bottom: 0,
                                                 right: 10,
                                             }}
                                >
                                    <Tooltip title="Edycja">
                                        <IconButton aria-label="edit"
                                                    onClick={onEditClick}
                                        >
                                            <Edit/>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Usuń">
                                        <IconButton aria-label="delete"
                                                    onClick={onDeleteClick}
                                        >
                                            <Delete/>
                                        </IconButton>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                            <DeleteClientNotesDialog open={openDialogDelete.find(e => e.id === note.id)?.value}
                                                     setOpen={() => {
                                                         let object = openDialogDelete.find(e => e.id === note.id)
                                                         object.value = !object.value

                                                         setOpenDialogDelete([...openDialogDelete, object])
                                                     }
                                                     }
                                                     note={note} params={props}/>

                            <ClientAddEditNotesDialog open={openDialogEdit.find(e => e.id === note.id)?.value}
                                                      setOpen={() => {
                                                          let object = openDialogEdit.find(e => e.id === note.id)
                                                          object.value = !object.value

                                                          setOpenDialogEdit([...openDialogEdit, object])
                                                      }}
                                                      clickedNote={note} params={props}/>
                        </Box>
                    )
                })}
            </Box>

            {!readOnly ?
                <>
                    <Box sx={{position: "absolute", bottom: -10, right: 0, zIndex: 20}}>
                        <Fab color="primary" aria-label="add" onClick={() => setOpenDialogAdd(true)}>
                            <Add/>
                        </Fab>

                    </Box>

                    <ClientAddEditNotesDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                              clickedNote={null} params={props}/>
                </>
                : ""
            }

        </>
    );
}
