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
import TextEditorB2B from "@/Components/TextEditor/B2B";


export default function NotesClientComponent(props) {
    const [edited, setEdited] = useState(false);

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors,
    } = useNotesClientForm()

    const {data, setData, processing, post} = useForm({
        'notes': '',
    })

    const initializeFieldValues = () => {
        setValue('notes', data.notes)
    }

    useEffect(() => {
        // inicjacja wartości pól
        initializeFieldValues()
    }, [setValue]);

    const onSubmit = (formData) => {
        saveBasic()
    }

    const resetForm = () => {
        setData({
            'notes': '',
        });

        initializeFieldValues()
        setEdited(false);

        clearErrors('notes')
    };
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
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Box sx={{display: "flex", flexDirection: "column"}}>

                <Typography
                    sx={{mb: 3, display: "flex", gap: 1, alignItems: "center"}}>
                    <NoteAddIcon fontSize={"large"}/>
                    Notatki do klienta
                </Typography>

                <TextEditorB2B
                    value={data.notes}
                    setValue={(value) => {
                        setData("notes", value)
                    }}
                    setEdited={value => setEdited(value)}
                    readOnly={!props.editing}
                />


                <Fade in={edited}>
                    <Button type="submit" variant="outlined" startIcon={<Save/>}
                            disabled={processing}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 230,
                            }}>
                        Zapisz
                    </Button>
                </Fade>
                <Fade in={edited}>
                    <Button variant="outlined" startIcon={<Cancel/>}
                            disabled={processing}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 335,
                            }}
                            onClick={resetForm}
                    >
                        Cofnij zmiany
                    </Button>
                </Fade>
            </Box>
        </form>
    );
}
