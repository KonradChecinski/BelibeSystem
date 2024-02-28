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
import ClientActivity from "@/Components/Other/ClientActivity";


export default function ClientActivityComponent(props) {
    return (

        <Box sx={{display: "flex", flexDirection: "column"}}>

            {/*<Typography*/}
            {/*    sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>*/}
            {/*    <EventAvailableIcon fontSize={"large"}/>*/}
            {/*    Aktywności klienta*/}
            {/*</Typography>*/}
            <Box sx={{pr: 0}}>
                <ClientActivity activities={props.client.activities} readOnly={!props.editing} props={props}/>
            </Box>
            {/*<Box sx={{pr: 0}}>*/}
            {/*    <ClientActivityTable activities={props.client.activities} readOnly={!props.editing} props={props}/>*/}
            {/*</Box>*/}
        </Box>

    );
}
