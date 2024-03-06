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
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ClientDiscountsTable from "@/Components/Table/ClientDiscountsTable";
import DiscountIcon from '@mui/icons-material/Discount';
import ClientDiscountsOnPaymentsTable from "@/Components/Table/ClientDiscountsOnPaymentsTable";


export default function ClientDiscountsComponent(props) {
    return (

        <Box sx={{display: "flex", flexDirection: "column"}}>

            <Typography
                sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                <DiscountIcon fontSize={"large"}/>
                Rabaty na produkty
            </Typography>

            <Box sx={{pr: 0, position: "relative"}}>
                <ClientDiscountsTable discounts={props.client?.discounts} readOnly={!props.editing} props={props}/>
            </Box>

            <Typography
                sx={{my: 3, display: "flex", gap: 1, alignItems: "center"}}>
                <DiscountIcon fontSize={"large"}/>
                Rabaty przy płatnościach
            </Typography>

            <Box sx={{pr: 0, position: "relative"}}>
                <ClientDiscountsOnPaymentsTable payments={props.client?.payments} readOnly={!props.editing}
                                                props={props}/>
            </Box>
        </Box>

    );
}
