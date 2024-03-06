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
import ClientActivityTable from "@/Components/Table/ClientActivityTable";
import HistoryIcon from '@mui/icons-material/History';
import ClientOrderHistoryTable from "@/Components/Table/ClientOrderHistoryTable";


export default function ClientOrderHistoryComponent(props) {
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
    // console.log("")
    return (

        <Box sx={{display: "flex", flexDirection: "column"}}>

            <Typography
                sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                <HistoryIcon fontSize={"large"}/>
                Historia zamówień klienta
            </Typography>

            <Box sx={{pr: 0}}>
                <ClientOrderHistoryTable history={[]} readOnly={!props.editing}/>
            </Box>
        </Box>

    );
}
