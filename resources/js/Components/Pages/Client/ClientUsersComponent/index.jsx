import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Box,
    Button,
    Fade,
    Typography
} from "@mui/material";
import {Cancel, Save} from "@mui/icons-material";
import {useNotesClientForm} from "@/Components/Pages/Client/ClientNotesComponent/form/useNotesClientForm";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ClientActivityTable from "@/Components/Table/ClientActivityTable";
import ClientUsersTable from "@/Components/Table/ClientUsersTable";


export default function ClientUsersComponent(props) {

    return (

        <Box sx={{display: "flex", flexDirection: "column"}}>

            <Typography
                sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                <PeopleAltIcon fontSize={"large"}/>
                Użytkownicy klienta
            </Typography>

            <Box sx={{pr: 0}}>
                <ClientUsersTable users={props.client?.client_users} readOnly={!props.editing} props={props}/>
            </Box>
        </Box>

    );
}
