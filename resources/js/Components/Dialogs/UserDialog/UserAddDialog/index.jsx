import {
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, Paper, Select,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {useUserAddForm} from "@/Components/Dialogs/UserDialog/UserAddDialog/form/useUserAddForm";

export default function UserAddDialog({open, setOpen, reloadData, roles}) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useUserAddForm()

    const {data, setData, post, processing, errors, clearErrors, reset} = useForm({
        name: '',
        email: '',
        password: '',
        roles: Array(),
    })

    useEffect(() => {
        // inicjacja wartości pól
        setValue("name", data.name)
        setValue("email", data.email)
        setValue("password", data.password)
        setValue("roles", data.roles)
    }, [setValue]);

    const onSubmit = (data) => {
        setData(data)
        setActiveStep(activeStep + 1)
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj nazwe",
        "Podsumowanie"
    ];

    const previousStep = () => {
        setActiveStep(activeStep - 1);
        clearErrors()
    }

    const handleClose = () => {
        setValue("name", "");
        setValue("email", "");
        setValue("password", "");
        setValue("roles", []);

        setData("roles", Array());

        clrErrors("name")
        clrErrors("email")
        clrErrors("password")
        clrErrors("roles")

        setActiveStep(0);

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

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

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
                            register={register}
                            errors={fieldErrors}
                            data={data}
                            setData={setData}
                            roles={roles}
                        />
                        : null}
                    {activeStep === 1 ? <Step2 data={data} setData={setData} roles={roles} errors={errors}/> : null}

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Zamknij
                    </Button>

                    <Button onClick={previousStep} disabled={activeStep === 0}>
                        Wstecz
                    </Button>

                    <Button type="submit"
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

    );
}

function Step1({register, errors, data, roles, setData}) {
    const onChangeSelect = (value) => {
        setData('roles', value.target.value);
    }

    const renderCell = (selected) => selected.map((value) => {
        return (<Typography key={value} variant="body1" gutterBottom>
            {roles.find(e => e.id === value).name}
        </Typography>);
    })


    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>

            <TextField
                type="text"
                id="name"
                label="Nazwa"
                color={errors.name?.message && "error"}
                {...register("name")}
                defaultValue={data.name}
                sx={{width: "30ch", my: 1}}
            />
            {errors.name?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.name?.message.toString()}
                </Typography>
            )}

            <TextField
                type="text"
                id="email"
                label="Email"
                color={errors.email?.message && "error"}
                {...register("email")}
                defaultValue={data.email}
                sx={{width: "30ch", my: 1, mt: 2}}
            />
            {errors.email?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.email?.message.toString()}
                </Typography>
            )}

            <TextField
                type="text"
                id="password"
                label="Hasło"
                color={errors.password?.message && "error"}
                {...register("password")}
                defaultValue={data.password}
                sx={{width: "30ch", my: 1, mt: 2}}
            />
            {errors.password?.message && (
                <Typography variant="body2" color="error" sx={{ml: 1}}>
                    {errors.password?.message.toString()}
                </Typography>
            )}

            <FormControl sx={{width: "30ch", mt: 2}}>
                <InputLabel>Role</InputLabel>
                <Select
                    id="role"
                    label="Role"
                    multiple={true}
                    color={errors.roles?.message && "error"}
                    {...register("roles")}
                    onChange={onChangeSelect}
                    value={data.roles}
                    renderValue={renderCell}
                >
                    {roles.map(role => {
                        return (
                            <MenuItem key={role.id} value={role.id}>
                                <Checkbox
                                    checked={data.roles.find(e => e === role.id) != null}/>
                                <ListItemText primary={role.name}/>
                            </MenuItem>
                        );
                    })}
                </Select>
                {errors.roles?.message && (
                    <Typography variant="body2" color="error" sx={{ml: 1, mt: 1}}>
                        {errors.roles?.message.toString()}
                    </Typography>
                )}
            </FormControl>

        </Box>
    );
}

function Step2({data, roles, errors}) {
    const renderCell = (selected) => selected.map((value) => {
        return (<Typography key={value} variant="body1" gutterBottom>
            {roles.find(e => e.id === value).name}
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
                return (<Typography variant="body2" color={"error"} align={"center"} gutterBottom key={index}>
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

