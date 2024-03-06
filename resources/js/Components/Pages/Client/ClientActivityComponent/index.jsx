import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Box,
    Button,
    Fade,
    Typography
} from "@mui/material";
import ClientActivity from "@/Components/Pages/Client/ClientActivityComponent/ClientActivity";


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
