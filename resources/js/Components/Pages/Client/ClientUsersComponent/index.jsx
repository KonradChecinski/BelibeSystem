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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ClientActivityTable from "@/Components/Table/ClientActivityTable";
import ClientUsersTable from "@/Components/Table/ClientUsersTable";


export default function ClientUsersComponent(props) {
    // const [edited, setEdited] = useState(false);
    //
    // const {
    //     register,
    //     handleSubmit,
    //     errors: fieldErrors,
    //     setValue,
    //     clearErrors,
    // } = useNotesClientForm()
    //
    // const {data, setData, processing, post} = useForm({
    //     'notes': '',
    // })
    //
    // const initializeFieldValues = () => {
    //     setValue('notes', data.notes)
    // }
    //
    // useEffect(() => {
    //     // inicjacja wartości pól
    //     initializeFieldValues()
    // }, [setValue]);

    const onSubmit = (formData) => {
        saveBasic()
    }

    // const resetForm = () => {
    //     setData({
    //         'notes': '',
    //     });
    //
    //     initializeFieldValues()
    //     setEdited(false);
    //
    //     clearErrors('notes')
    // };
    const saveBasic = () => {
        // post(route("system.products.model.update.basic", {productModel: data.id}), {
        //     onSuccess: params => {
        //         setEdited(false);
        //         enqueueSnackbar("Zapisano Podstawowe informację", {variant: 'success'})
        //     },
        //     onError: params => {
        //         console.error(params)
        //         enqueueSnackbar("Błąd przy zapisywaniu podstawowych informacji", {variant: 'error'})
        //     },
        //     preserveScroll: true
        // })
    }

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
