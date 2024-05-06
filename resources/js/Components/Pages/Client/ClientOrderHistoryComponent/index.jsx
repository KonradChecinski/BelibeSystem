import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Box,
    Button,
    Fade,
    Typography
} from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import ClientOrderHistoryTable from "@/Components/Table/Client/ClientOrderHistoryTable";


export default function ClientOrderHistoryComponent(props) {
    console.log(props)
    return (

        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Box sx={{pr: 0}}>
                <ClientOrderHistoryTable history={props.client.orders} readOnly={!props.editing} props={props}/>
            </Box>
        </Box>

    );
}
