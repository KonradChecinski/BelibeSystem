import {useEffect, useState} from "react";
import {
    Box, Button,
    Card, CardActions,
    CardContent, Chip,
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
import DeleteClientTaskDialog from "@/Components/Dialogs/ClientDialog/ClientDeleteDialogs/DeleteClientTaskDialog";
import ClientAddEditTasksDialog from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditTasksDialog";

export default function ClientTasks({tasks, readOnly, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(tasks.map((task) => ({id: task.id, value: false})));
    const [openDialogEdit, setOpenDialogEdit] = useState(tasks.map((task) => ({id: task.id, value: false})));

    const [showDone, setShowDone] = useState(false);

    useEffect(() => {
        setOpenDialogDelete(tasks.map((task) => ({id: task.id, value: false})))
        setOpenDialogEdit(tasks.map((task) => ({id: task.id, value: false})))
    }, [props])

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, mb: 3}}>
                {tasks.filter((o) => {
                    return showDone || !o.done
                    // if (showDone) return true;
                    // return
                }).sort((a, b) => moment(b.datetime).diff(a.datetime)).map((task) => {
                    const isExpired = () => {
                        return !(task.done || moment().diff(task.datetime) <= 0)
                    }
                    const isDone = () => {
                        return Boolean(task.done)
                    }

                    const onEditClick = (e) => {
                        // setOpenDialogAdd(true)
                        let object = openDialogEdit.find(e => e.id === task.id)
                        object.value = !object.value

                        setOpenDialogEdit([...openDialogEdit, object])
                    };

                    const onDeleteClick = (e) => {
                        // setOpenDialogDelete(true);

                        let object = openDialogDelete.find(e => e.id === task.id)
                        object.value = !object.value

                        setOpenDialogDelete([...openDialogDelete, object])
                    };
                    return (
                        <Box key={task.id}>
                            <Card variant="outlined"
                                  sx={{
                                      position: "relative",
                                      px: 1,
                                      bgcolor: isExpired() ? "errorBg.main" : isDone() ? "successBg.main" : "",
                                  }}>
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                        mb: 1
                                    }}>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}>
                                            <Typography
                                                sx={{
                                                    fontSize: 16,
                                                }}>
                                                {task.title}
                                            </Typography>
                                            {/*<Divider orientation="vertical" flexItem/>*/}
                                        </Box>

                                        <Chip label={moment(task.datetime).format("DD-MM-YYYY HH:mm")}
                                              variant="outlined"
                                              color={isExpired() ? "error" : "default"}/>

                                    </Box>

                                    <Divider variant="middle"/>

                                    <Typography sx={{
                                        my: 2,
                                        fontSize: "11px"
                                    }}>
                                        {task.text}
                                    </Typography>
                                    <Divider variant="middle"/>


                                    <Box sx={{
                                        display: 'inline-flex',
                                        gap: 1,
                                        mt: 1
                                    }}>
                                        <Typography sx={{fontSize: "10px"}}>
                                            {task.user.name}
                                        </Typography>
                                        <Divider orientation="vertical" flexItem/>
                                        <Tooltip title="Dodano" arrow>
                                            <Typography sx={{fontSize: "10px"}}>
                                                {moment(task.created_at).format("DD-MM-YYYY HH:mm")}
                                            </Typography>
                                        </Tooltip>
                                        {
                                            task.done ?
                                                <>
                                                    <Divider orientation="vertical" flexItem/>
                                                    <Tooltip title="Zakończono" arrow>
                                                        <Typography sx={{fontSize: "10px"}}>
                                                            {moment(task.done).format("DD-MM-YYYY HH:mm")}
                                                        </Typography>
                                                    </Tooltip>
                                                </>
                                                : ""
                                        }

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

                            <DeleteClientTaskDialog open={openDialogDelete.find(e => e.id === task.id)?.value}
                                                    setOpen={() => {
                                                        let object = openDialogDelete.find(e => e.id === task.id)
                                                        object.value = !object.value

                                                        setOpenDialogDelete([...openDialogDelete, object])
                                                    }
                                                    }
                                                    task={task} params={props}/>

                            <ClientAddEditTasksDialog open={openDialogEdit.find(e => e.id === task.id)?.value}
                                                      setOpen={() => {
                                                          let object = openDialogEdit.find(e => e.id === task.id)
                                                          object.value = !object.value

                                                          setOpenDialogEdit([...openDialogEdit, object])
                                                      }}
                                                      clickedTask={task} params={props}/>
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
                    <Box sx={{position: "absolute", top: 0, right: 120, zIndex: 20}}>

                        <Button
                            variant={showDone ? "contained" : "outlined"}
                            onClick={() => setShowDone(!showDone)}
                            sx={{height: "25px", mt: 1}}
                        >
                            Pokaż zakończone
                        </Button>

                    </Box>

                    <ClientAddEditTasksDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                              clickedTask={null} params={props}/>
                </>
                : ""
            }

        </>
    );
}
