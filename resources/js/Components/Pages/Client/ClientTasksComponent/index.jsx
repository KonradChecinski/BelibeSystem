import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Box,
    Button,
    Fade,
    Typography
} from "@mui/material";
import {Cancel, Save} from "@mui/icons-material";
import {useNotesClientForm} from "@/Components/Pages/Client/NotesClientComponent/form/useNotesClientForm";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ClientActivityTable from "@/Components/Table/ClientActivityTable";
import ClientTasksTable from "@/Components/Table/ClientTasksTable";
import TaskIcon from '@mui/icons-material/Task';
import ClientNotes from "@/Components/Other/ClientNotes";
import ClientTasks from "@/Components/Other/ClientTask";


export default function ClientTasksComponent(props) {
    // console.log("Propsy: ", props)
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>

            {/*<Typography*/}
            {/*    sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>*/}
            {/*    <TaskIcon fontSize={"large"}/>*/}
            {/*    Zadania klienta*/}
            {/*</Typography>*/}

            <Box sx={{pr: 0}}>
                <ClientTasks tasks={props.client.tasks} readOnly={!props.editing} props={props}/>
            </Box>

            {/*<Box sx={{pr: 0}}>*/}
            {/*    <ClientTasksTable tasks={props.client.tasks} readOnly={!props.editing} props={props}/>*/}
            {/*</Box>*/}
        </Box>

    );
}
