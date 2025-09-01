import {useEffect, useState} from "react";
import {router, useForm} from "@inertiajs/react";
import {
    Box,
    Button
} from "@mui/material";
import {Mail, Work} from "@mui/icons-material";


export default function ClientActionComponent(props) {
    return (

        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 1}}>
            {/*Mail Button*/}
            <Button
                variant="outlined"
                startIcon={<Mail/>}
                onClick={() => router.visit(route("system.clients.client.emails", {client: props.client.id}))}
            >
                Historia maili
            </Button>
            {/*B2B Button*/}
            <Button
                variant="contained"
                startIcon={<Work/>}
                onClick={() => router.post(route("system.b2b.order.start", {client: props.client.id}))}
            >
                Przejdź do B2B
            </Button>
        </Box>

    );
}
