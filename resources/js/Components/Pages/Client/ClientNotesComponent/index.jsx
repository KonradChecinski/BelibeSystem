import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import {
    Box,
    Button, Card, CardActions, CardContent, Chip, Divider,
    Fade, IconButton, Tooltip,
    Typography
} from "@mui/material";
import {Cancel, Delete, Edit, ExpandMore, Save} from "@mui/icons-material";
import {useNotesClientForm} from "@/Components/Pages/Client/ClientNotesComponent/form/useNotesClientForm";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TextEditorB2B from "@/Components/TextEditor/B2B";
import ClientOrderHistoryTable from "@/Components/Table/ClientOrderHistoryTable";
import ClientNotesTable from "@/Components/Table/ClientNotesTable";
import ClientNotes from "@/Components/Pages/Client/ClientNotesComponent/ClientNotes";


export default function NotesClientComponent(props) {
    return (

        <Box sx={{display: "flex", flexDirection: "column"}}>

            {/*<Typography*/}
            {/*    sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>*/}
            {/*    <NoteAddIcon fontSize={"large"}/>*/}
            {/*    Notatki do klienta*/}
            {/*</Typography>*/}

            <Box sx={{pr: 0}}>
                <ClientNotes notes={props.client.notes} readOnly={!props.editing} props={props}/>
            </Box>

            {/*<Box sx={{pr: 0}}>*/}
            {/*    <ClientNotesTable notes={props.client.notes} readOnly={!props.editing} props={props}/>*/}
            {/*</Box>*/}


            {/*<TextEditorB2B*/}
            {/*    value={data.notes}*/}
            {/*    setValue={(value) => {*/}
            {/*        setData("notes", value)*/}
            {/*    }}*/}
            {/*    setEdited={setEdited}*/}
            {/*    readOnly={!props.editing}*/}
            {/*/>*/}


            {/*<Fade in={edited}>*/}
            {/*    <Button type="submit" variant="outlined" startIcon={<Save/>}*/}
            {/*            disabled={processing}*/}
            {/*            sx={{*/}
            {/*                position: "absolute",*/}
            {/*                top: 7,*/}
            {/*                right: 230,*/}
            {/*            }}>*/}
            {/*        Zapisz*/}
            {/*    </Button>*/}
            {/*</Fade>*/}
            {/*<Fade in={edited}>*/}
            {/*    <Button variant="outlined" startIcon={<Cancel/>}*/}
            {/*            disabled={processing}*/}
            {/*            sx={{*/}
            {/*                position: "absolute",*/}
            {/*                top: 7,*/}
            {/*                right: 335,*/}
            {/*            }}*/}
            {/*            onClick={resetForm}*/}
            {/*    >*/}
            {/*        Cofnij zmiany*/}
            {/*    </Button>*/}
            {/*</Fade>*/}
        </Box>

    );
}
