import {
    Autocomplete,
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import moment from "moment";
import {
    useClientNotesDialogForm
} from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditNotesDialog/form/useClientNotesDialogForm";
import {TextareaAutosize} from '@mui/base/TextareaAutosize';
import {enqueueSnackbar} from "notistack";


export default function ClientAddEditNotesDialog({
                                                     open,
                                                     setOpen,
                                                     clickedNote,
                                                     params
                                                 }) {

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientNotesDialogForm();

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        text: clickedNote ? clickedNote.text : '',
        user: clickedNote ? {
            id: clickedNote.user.id,
            name: clickedNote.user.name,
            label: clickedNote.user.name,
        } : null,
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue('text', data.text)
        setValue('user', clickedNote?.user)


        setData({
            text: clickedNote ? clickedNote.text : '',
            user: clickedNote ? {
                id: clickedNote.user.id,
                name: clickedNote.user.name,
                label: clickedNote.user.name,
            } : null,
        })

        // console.log("data w useEffect: ", data);
    }, [setValue, clickedNote]);

    const onSubmit = (submitData) => {
        // console.log("Dane z submit: ", submitData)
        // console.log("Dane z InertiaJS: ", data)

        setActiveStep(activeStep + 1)
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj dane",
        "Podsumowanie"
    ];

    const previousStep = () => {
        setActiveStep(activeStep - 1);
        clearErrors()
    }

    const handleClose = () => {
        clearErrors()
        clrErrors("text")
        clrErrors("user")

        setActiveStep(0);
        setOpen(false);
    }

    const save = () => {
        if (clickedNote) {
            patch(route("system.clients.client.note.update", {
                    client: params.client.id,
                    clientNote: clickedNote.id
                }),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Edytowano notatkę", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy edycji notatki", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            post(route("system.clients.client.note", {client: params.client.id}),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano notatkę", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy dodawniu notatki", {variant: 'error'})
                        console.error(errors)
                    },
                })
        }

    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                scroll="paper"
            >
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                    <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                        {clickedNote ? "Edytuj notatkę do klienta" : "Dodaj notatkę do klienta"}
                    </DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{mt: 1, mb: 3}}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {activeStep === 0 ?
                            <Step1
                                data={data}
                                setData={setData}
                                params={params}
                                clickedNote={clickedNote}
                                register={register}
                                errors={fieldErrors}
                            /> : null}
                        {activeStep === 1 ?
                            <Step2 data={data} setData={setData} params={params} errors={errors}/> : null}

                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Zamknij
                        </Button>

                        <Button onClick={previousStep} disabled={activeStep === 0}>
                            Wstecz
                        </Button>

                        <Button type="submit" disabled={activeStep === 1}
                                sx={{display: activeStep === 1 ? "none" : "block"}}>
                            Następne
                        </Button>

                        <Button onClick={save} disabled={processing}
                                sx={{display: activeStep === 0 ? "none" : "block"}}>
                            Zapisz
                        </Button>
                    </DialogActions>

                </form>
            </Dialog>
        </>
    );
}

function Step1({data, setData, params, clickedNote = null, register, errors}) {
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden", gap: 0.5
        }}>
            <Box>
                <TextField
                    type="text"
                    id="text"
                    label="Treść"
                    multiline
                    minRows={3}
                    color={errors.text?.message && "error"}
                    {...register("text")}
                    onChange={(value) => {
                        setData('text', value.target.value);
                    }}
                    defaultValue={data.text}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.text?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.text?.message.toString()}
                    </Typography>
                )}
            </Box>
            {params.auth.permissions.includes("changeUserInClientRelation") ?
                <Box>
                    <Autocomplete
                        id="user"
                        options={params.user.map(e => ({
                            id: e.id,
                            name: e.name,
                            label: e.name
                        }))}
                        sx={{width: "30ch"}}
                        value={data.user}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(e, value) => {
                            setData({
                                ...data,
                                user: value,
                            })
                        }}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Użytkownik"
                                sx={{my: 1}}
                                {...register("user")}
                                value={data.user}
                                color={errors.user?.message && "error"}
                            />
                        }
                    />
                    {errors.user?.message && (
                        <Typography variant="body2" color="error" sx={{ml: 1, mt: -0.5, mb: 1.5}}>
                            {errors.user?.message.toString()}
                        </Typography>
                    )}
                </Box>
                : null
            }

        </Box>
    );
}

function Step2({data, params, errors}) {
    let date = moment(data.date).format("YYYY-MM-DD HH:mm:ss")

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="text" label="Treść" variant="outlined"
                       value={data.text}
                       multiline
                       minRows={3}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            {/*<TextField id="date" label="Data" variant="outlined"*/}
            {/*           value={date}*/}
            {/*           disabled={true}*/}
            {/*           sx={{width: "30ch", my: 1, mt: 4}}*/}

            {/*/>*/}
            {params.auth.permissions.includes("changeUserInClientRelation") ?
                <TextField id="user" label="Użytkownik" variant="outlined"
                           value={data.user.label}
                           disabled={true}
                           sx={{width: "30ch", my: 1}}/>
                : null
            }

            {Object.keys(errors).map((key, index) => {
                return (<Typography variant="body1" color={"error"} align={"center"} gutterBottom key={index}>
                    {errors[key]}
                </Typography>)

            })}
        </Box>
    );
}

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

