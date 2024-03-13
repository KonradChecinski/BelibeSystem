import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Box,
    Button,
    Fade,
    Typography
} from "@mui/material";
import ClientLocationsTable from "@/Components/Table/Client/ClientLocationsTable";
import LocationOnIcon from '@mui/icons-material/LocationOn';


export default function ClientLocationsComponent(props) {

    return (

        <Box sx={{display: "flex", flexDirection: "column"}}>

            {/*<Typography*/}
            {/*    sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>*/}
            {/*    <LocationOnIcon fontSize={"large"}/>*/}
            {/*    Lokacje klienta*/}
            {/*</Typography>*/}

            <Box sx={{pr: 0}}>
                <ClientLocationsTable locations={props.client?.locations} readOnly={!props.editing} props={props}/>
            </Box>
        </Box>

    );
}
