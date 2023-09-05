import {
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, ListItemText, MenuItem, Paper,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';
import {useState, useRef} from "react";
import Draggable from "react-draggable";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function UserAddDialog({open, setOpen, reloadData, roles, params}) {
    const form = useRef();
    const formName = useRef();
    const formPassword = useRef();
    const formEmail = useRef();
    const formRole = useRef();

    const {data, setData, post, processing, errors, clearErrors, reset} = useForm({
        name: '',
        email: '',
        password: '',
        roles: [],
    })


    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj nazwe",
        "Podsumowanie"
    ];


    const nextStep = () => {
        if (activeStep == 0) {
            if (!formName.current.isValid() || data.name === "") return;
            if (!formPassword.current.isValid() || data.name === "") return;
            if (!formEmail.current.isValid() || data.email === "") return;
            if (!formRole.current.isValid() || data.roles.length == 0) return;
        }
        setActiveStep(activeStep + 1)

    }
    const previousStep = () => {
        setActiveStep(activeStep - 1);
        clearErrors()
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        post(route("system.settings.users"),

            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setActiveStep(0);
                    enqueueSnackbar("Dodano użytkownika", {variant: 'success'})
                    reloadData();
                    handleClose();
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy zapisywaniu użytkownika", {variant: 'error'})
                    console.error(errors)
                },
            })


    }


    return (

        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
        >

            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                Dodawanie użytkownika
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
                        roles={roles}
                        formRef={form}
                        formNameRef={formName}
                        formEmailRef={formEmail}
                        formPasswordRef={formPassword}
                        formRoleRef={formRole}
                    /> : ""}
                {activeStep === 1 ? <Step2 data={data} setData={setData} roles={roles} errors={errors}/> : ""}

            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Zamknij
                </Button>

                <Button onClick={previousStep} disabled={activeStep === 0}>
                    Wstecz
                </Button>

                <Button onClick={nextStep} disabled={activeStep === 1}
                        sx={{display: activeStep === 1 ? "none" : "block"}}>
                    Następne
                </Button>

                <Button onClick={save} disabled={processing}
                        sx={{display: activeStep === 0 ? "none" : "block"}}>
                    Zapisz
                </Button>
            </DialogActions>

        </Dialog>

    );
}

function Step1({data, setData, roles, formRef, formNameRef, formPasswordRef, formEmailRef, formRoleRef}) {
    const onChangeSelect = (value) => {
        setData('roles', value.target.value);
    }
    const renderCell = (selected) => selected.map((value) => {
        return (<Typography key={value} variant="body1" gutterBottom>
            {roles.find(e => e.id == value).name}
        </Typography>);
    })


    return (
        <Box>
            <ValidatorForm instantValidate ref={formRef} onSubmit={() => {
            }}>
                <TextValidator
                    id="name"
                    label="Nazwa"
                    ref={formNameRef}
                    onChange={(value) => {
                        setData('name', value.target.value);
                    }}
                    validators={['required', 'minStringLength:3']}
                    errorMessages={['Pole wymagane', 'Minimalna długość nazwy to 3']}
                    // errorMessages={['this field is required']}
                    value={data.name}
                    sx={{width: "30ch", my: 1}}
                />

                <TextValidator
                    id="email"
                    label="Email"
                    ref={formEmailRef}
                    onChange={(value) => {
                        setData('email', value.target.value);
                    }}
                    validators={['required', 'isEmail']}
                    errorMessages={['Pole wymagane', 'Musi być adresem email']}
                    // errorMessages={['this field is required']}
                    value={data.email}
                    sx={{width: "30ch", my: 1}}
                />

                <TextValidator
                    id="password"
                    label="Hasło"
                    ref={formPasswordRef}
                    onChange={(value) => {
                        setData('password', value.target.value);
                    }}
                    validators={['required', 'minStringLength:8']}
                    errorMessages={['Pole wymagane', 'Minimalna długość hasła to 8']}
                    value={data.password}
                    sx={{width: "30ch", my: 1}}
                />

                <SelectValidator
                    id="role"
                    label="Role"
                    ref={formRoleRef}

                    validators={['required']}
                    errorMessages={['Pole wymagane']}
                    SelectProps={{
                        multiple: true,
                        value: data.roles,
                        onChange: onChangeSelect,
                        renderValue: renderCell
                    }}
                    sx={{width: "30ch", my: 1}}>
                    {roles.map(role => {

                        return (
                            <MenuItem key={role.id} value={role.id}>
                                <Checkbox
                                    checked={data.roles.find(e => e === role.id) != null}/>
                                <ListItemText primary={role.name}/>
                            </MenuItem>
                        );
                    })}

                </SelectValidator>
            </ValidatorForm>
        </Box>
    );
}

function Step2({data, setData, roles, errors}) {
    console.log(errors)
    const renderCell = (selected) => selected.map((value) => {
        return (<Typography key={value} variant="body1" gutterBottom>
            {roles.find(e => e.id == value).name}
        </Typography>);
    })
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="name" label="Nazwa" variant="outlined"
                       value={data.name}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>

            <TextField id="email" label="Email" variant="outlined"
                       value={data.email}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>
            <TextField id="password" label="Hasło" variant="outlined"
                       value={data.password}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>
            <TextField
                select
                id="role2"
                label="Role"
                disabled={true}
                SelectProps={{
                    multiple: true,
                    value: data.roles,
                    // onChange: onChangeSelect,
                    renderValue: renderCell
                }}
                sx={{width: "30ch", my: 1}}>
                {roles.map(role => {

                    return (
                        <MenuItem key={role.id} value={role.id}>
                            <Checkbox
                                checked={data.roles.find(e => e === role.id) != null}/>
                            <ListItemText primary={role.name}/>
                        </MenuItem>
                    );
                })}
            </TextField>
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

