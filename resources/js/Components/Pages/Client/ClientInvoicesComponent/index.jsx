import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Box,
    Button,
    Fade,
    Typography
} from "@mui/material";
import ClientInvoicesTable from "@/Components/Table/Client/ClientInvoicesTable";


export default function ClientInvoicesComponent(props) {

    return (

        <Box sx={{display: "flex", flexDirection: "column"}}>

            <Box sx={{pr: 0}}>
                <ClientInvoicesTable invoices={props.client.invoices} readOnly={!props.editing}/>
            </Box>
        </Box>

    );
}
