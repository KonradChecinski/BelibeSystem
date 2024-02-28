import {useEffect, useState} from "react";
import {
    Box,
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
import ClientAddEditActivitiesDialog
    from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditActivitiesDialog";
import DeleteClientActivityDialog
    from "@/Components/Dialogs/ClientDialog/ClientDeleteDialogs/DeleteClientActivityDialog";

export default function ClientActivity({activities, readOnly, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);
    const [openDialogDelete, setOpenDialogDelete] = useState(activities.map((activity) => ({
        id: activity.id,
        value: false
    })));
    const [openDialogEdit, setOpenDialogEdit] = useState(activities.map((activity) => ({
        id: activity.id,
        value: false
    })));

    useEffect(() => {
        setOpenDialogDelete(activities.map((activity) => ({id: activity.id, value: false})))
        setOpenDialogEdit(activities.map((activity) => ({id: activity.id, value: false})))
    }, [props])
    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, mb: 3}}>
                {activities.map((activity) => {

                    const onEditClick = (e) => {
                        // setOpenDialogAdd(true)
                        let object = openDialogEdit.find(e => e.id === activity.id)
                        object.value = !object.value

                        setOpenDialogEdit([...openDialogEdit, object])
                    };

                    const onDeleteClick = (e) => {
                        // setOpenDialogDelete(true);

                        let object = openDialogDelete.find(e => e.id === activity.id)
                        object.value = !object.value

                        setOpenDialogDelete([...openDialogDelete, object])
                    };
                    return (
                        <Box key={activity.id}>
                            <Card variant="outlined"

                                  sx={{
                                      position: "relative",
                                      px: 1
                                  }}>
                                <CardContent>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        gap: 1,
                                        mb: 1
                                    }}>
                                        <Typography>
                                            {activity.activity_type?.name}
                                        </Typography>
                                        <Divider orientation="vertical" flexItem/>
                                        <Typography sx={{fontSize: "11px"}}>
                                            {activity.description}
                                        </Typography>
                                    </Box>
                                    <Divider variant="middle"/>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        gap: 1,
                                        mt: 1
                                    }}>
                                        <Typography sx={{fontSize: "10px"}}>
                                            {activity.user.name}
                                        </Typography>
                                        <Divider orientation="vertical" flexItem/>
                                        <Tooltip title="Dodano" arrow>
                                            <Typography sx={{fontSize: "10px"}}>
                                                {moment(activity.datetime).format("DD-MM-YYYY HH:mm")}
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
                            <DeleteClientActivityDialog open={openDialogDelete.find(e => e.id === activity.id)?.value}
                                                        setOpen={() => {
                                                            let object = openDialogDelete.find(e => e.id === activity.id)
                                                            object.value = !object.value

                                                            setOpenDialogDelete([...openDialogDelete, object])
                                                        }
                                                        }
                                                        activity={activity} params={props}/>

                            <ClientAddEditActivitiesDialog open={openDialogEdit.find(e => e.id === activity.id)?.value}
                                                           setOpen={() => {
                                                               let object = openDialogEdit.find(e => e.id === activity.id)
                                                               object.value = !object.value

                                                               setOpenDialogEdit([...openDialogEdit, object])
                                                           }}
                                                           clickedActivity={activity} params={props}/>
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

                    <ClientAddEditActivitiesDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                                   clickedActivity={null}
                                                   params={props}/>
                </>
                : ""
            }

        </>
    );
}
