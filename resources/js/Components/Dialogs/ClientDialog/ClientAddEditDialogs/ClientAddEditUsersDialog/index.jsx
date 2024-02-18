import {
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
import {
    useClientUsersDialogForm
} from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditUsersDialog/form/useClientUsersDialogForm";
import {enqueueSnackbar} from "notistack";

export default function ClientAddEditUsersDialog({
                                                     open,
                                                     setOpen,
                                                     clickedUser,
                                                     props,
                                                 }) {

    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientUsersDialogForm();

    // const [color, setColor] = useState({});


    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm({
        name: clickedUser ? clickedUser.name : '',
        email: clickedUser ? clickedUser.email : '',
    })

    useEffect(() => {
        console.log("Clicked user w useEffect: ", clickedUser);

        // inicjacja wartości pól
        setValue('name', clickedUser?.name);
        setValue('email', clickedUser?.email);

        setData({
            name: clickedUser ? clickedUser.name : '',
            email: clickedUser ? clickedUser.email : '',
        })

        console.log("data w useEffect: ", data);
    }, [setValue, clickedUser]);

    const onSubmit = (submitData) => {
        console.log("Dane z submit: ", submitData)
        console.log("Dane z InertiaJS: ", data)

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
        clrErrors("name")
        clrErrors("email")

        // setClickedUser(null)

        setActiveStep(0);
        setOpen(false);
    }

    const save = () => {
        if (clickedUser) {
            patch(route("system.clients.client.user.update", {
                    client: props.client.id,
                    clientUser: clickedUser.id
                }),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Edytowano użytkownika klienta", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy edycji użytkownika klienta", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            post(route("system.clients.client.user", {client: props.client.id}),

                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano użytkownika klienta", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy dodawniu użytkownika klienta", {variant: 'error'})
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
                        {clickedUser ? "Edytuj użytkownika klienta" : "Dodaj użytkownika klienta"}
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
                                clickedUser={clickedUser}
                                register={register}
                                errors={fieldErrors}
                            /> : null}
                        {activeStep === 1 ? <Step2 data={data} setData={setData} errors={errors}/> : null}

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

function Step1({data, setData, clickedUser = null, register, errors}) {
    return (
        <Box sx={{
            display: "flex", flexDirection: "column", overflowX: "hidden",
            overflowY: "hidden", gap: 0.5
        }}>
            <Box>
                <TextField
                    type="text"
                    id="name"
                    label="Nazwa użytkownika"
                    color={errors.name?.message && "error"}
                    {...register("name")}
                    onChange={(value) => {
                        setData('name', value.target.value);
                    }}
                    defaultValue={data.name}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.name?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.name?.message.toString()}
                    </Typography>
                )}
            </Box>

            <Box>
                <TextField
                    type="text"
                    id="email"
                    label="Email"
                    color={errors.email?.message && "error"}
                    {...register("email")}
                    onChange={(value) => {
                        setData('email', value.target.value);
                    }}
                    defaultValue={data.email}
                    sx={{width: "30ch", my: 1}}
                />
                {errors.email?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1}}>
                        {errors.email?.message.toString()}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

function Step2({data, errors}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="name" label="Nazwa użytkownika" variant="outlined"
                       value={data.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="email" label="Email" variant="outlined"
                       value={data.email}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>


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

