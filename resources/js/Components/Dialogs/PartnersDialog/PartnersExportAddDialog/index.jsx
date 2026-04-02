import {
    Autocomplete,
    Box, Button, Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, MenuItem, Paper, Select,
    Step,
    StepLabel,
    Stepper,
    TextField, Typography
} from "@mui/material";
import {useState, useEffect, useCallback} from "react";
import Draggable from "react-draggable";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {Cron} from "@/Components/Dialogs/PartnersDialog/PartnersExportAddDialog/Cron";
import POLISH_LOCALE from "@/Components/Dialogs/PartnersDialog/PartnersExportAddDialog/pl_locale";

export default function PartnersExportAddDialog({open, setOpen, partner, exportElement = null}) {

    const {data, setData, post, patch, processing, reset} = useForm({
        type: exportElement ? exportElement.type : 1,
        cron: exportElement ? exportElement.cron : '0 2 * * 3',
        availability: exportElement ? exportElement.availability : false,
        ean: exportElement ? exportElement.ean : false,
        wholesale_net_price: exportElement ? !!exportElement.wholesale_net_price : false,
        retail_gross_price: exportElement ? !!exportElement.retail_gross_price : false,
        description: exportElement ? !!exportElement.description : false,
        image_basic: exportElement ? !!exportElement.image_basic : false,
        image_square: exportElement ? !!exportElement.image_square : false,
        image_webp: exportElement ? !!exportElement.image_webp : false,

    })

    useEffect(() => {
        setData({
            type: exportElement ? exportElement.type : 1,
            cron: exportElement ? exportElement.cron : '0 2 * * 3',
            availability: exportElement ? exportElement.availability : false,
            ean: exportElement ? exportElement.ean : false,
            wholesale_net_price: exportElement ? !!exportElement.wholesale_net_price : false,
            retail_gross_price: exportElement ? !!exportElement.retail_gross_price : false,
            description: exportElement ? !!exportElement.description : false,
            image_basic: exportElement ? !!exportElement.image_basic : false,
            image_square: exportElement ? !!exportElement.image_square : false,
            image_webp: exportElement ? !!exportElement.image_webp : false,
        })
    }, [exportElement]);

    const nextStep = () => {
        setActiveStep(activeStep + 1)

        // console.log("Client data: ", data)
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Podaj dane",
        "Podsumowanie"
    ];
    const previousStep = () => {
        setActiveStep(activeStep - 1);
    }

    const handleClose = () => {
        setActiveStep(0);
        setOpen(false);
    };

    const save = () => {
        if (exportElement) {
            patch(route("system.partners.partner.export.update", {partner: partner.id, export: exportElement.id}),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Edytowano partnera", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        console.error(errors)
                        enqueueSnackbar("Błąd przy edycji partnera", {variant: 'error'})
                        for (const errorsKey in errors) {
                            enqueueSnackbar(errors[errorsKey], {variant: 'error'})
                        }

                    },
                })
        } else {
            post(route("system.partners.partner.export.create", {partner: partner.id}),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        setActiveStep(0);
                        enqueueSnackbar("Dodano partnera", {variant: 'success'})
                        handleClose();
                    },
                    onError: errors => {
                        enqueueSnackbar("Błąd przy dodawaniu partnera", {variant: 'error'})
                        console.error(errors)
                    },
                })
        }
    }

    const getLabel = (option) => {
        switch (option) {
            case 1:
                return "XML"
            case 2:
                return "Excel"
            case 3:
                return "CSV"
        }
    }

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
            maxWidth={"sm"}
            fullWidth={true}
        >


            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                {exportElement ? "Edycja" : "Dodawanie"} eksportu partnera
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
                    <Step1 data={data} setData={setData} getLabel={getLabel}/> : null}
                {activeStep === 1 ? <Step2 data={data} setData={setData} getLabel={getLabel}/> : null}


            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Zamknij
                </Button>
                <Button onClick={previousStep} disabled={activeStep === 0}>
                    Wstecz
                </Button>

                <Button onClick={nextStep}
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

function Step1({data, setData, getLabel}) {

    const [error, onError] = useState()


    useEffect(() => {
        if (data.type !== 1) {
            if (data.image_basic || data.image_square || data.image_webp) {
                setData(current => ({
                    ...current,
                    image_basic: false,
                    image_square: false,
                    image_webp: false,
                }));
            }
        }
    }, [data.type])

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Autocomplete
                disablePortal
                id="type"
                options={[
                    1, 2, 3
                ]}
                sx={{width: "30ch"}}
                value={data.type}
                getOptionLabel={getLabel}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(e, value) => setData("type", value)}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Typ"
                        sx={{my: 1}}
                        value={data.type}
                    />}
            />


            <Box sx={{mt: 2}}>
                <Paper sx={{p: 2}}>
                    <Typography variant="h6" gutterBottom>
                        Zawartość pliku
                    </Typography>

                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.availability}
                                    onChange={(e) => setData("availability", e.target.checked)}
                                />
                            }
                            label="Dostępność"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.ean}
                                    onChange={(e) => setData("ean", e.target.checked)}
                                />
                            }
                            label="EAN (kod kreskowy)"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.wholesale_net_price}
                                    onChange={(e) => setData("wholesale_net_price", e.target.checked)}
                                />
                            }
                            label="Cena hurtowa netto (wyliczana dla klienta z uwzględnieniem jego rabatów)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.retail_gross_price}
                                    onChange={(e) => setData("retail_gross_price", e.target.checked)}
                                />
                            }
                            label="Cena detaliczna brutto"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.description}
                                    onChange={(e) => setData("description", e.target.checked)}
                                />
                            }
                            label="Opis"
                        />

                        <Typography variant="subtitle1" sx={{mt: 1}}>
                            Obrazy (dostępne tylko dla typu XML)
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.image_basic}
                                    disabled={data.type !== 1}
                                    onChange={(e) => setData("image_basic", e.target.checked)}
                                />
                            }
                            label="Zdjęcie podstawowy"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.image_square}
                                    disabled={data.type !== 1}
                                    onChange={(e) => setData("image_square", e.target.checked)}
                                />
                            }
                            label="Zdjęcie kwadratowy"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.image_webp}
                                    disabled={data.type !== 1}
                                    onChange={(e) => setData("image_webp", e.target.checked)}
                                />
                            }
                            label="Zdjęcie WEBP"
                        />
                    </Box>
                </Paper>
            </Box>

            {/* Gdy typ ≠ 1, odznacz obrazy i zostaw wyłączone */}
            {/*
              Użycie funkcjonalnej wersji setData, aby bezpiecznie zaktualizować wiele pól naraz,
              zgodnie z API Inertia useForm.
            */}


            <Box sx={{mt: 2}}>
                <Paper sx={{p: 2}}>
                    <Typography variant="h6" gutterBottom>
                        Częstotliwość aktualizacji pliku
                    </Typography>
                    <TextField
                        type="text"
                        id="cron"
                        label="Częstotliwość"
                        value={data.cron}
                        disabled={true}
                        sx={{width: "30ch", my: 1}}
                    />
                    <Cron
                        value={data.cron}
                        setValue={(value, e) => setData("cron", value)}
                        onError={onError}
                        clearButton={false}
                        leadingZero={true}
                        shortcuts={false}
                        locale={POLISH_LOCALE}
                        className={"my-project-cron"}
                    />
                </Paper>

            </Box>
        </Box>
    );
}

function Step2({data, getLabel}) {
    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <TextField id="type" label="Typ" variant="outlined"
                       value={getLabel(data.type)}
                       disabled={true}
                       sx={{width: "30ch", my: 1}}/>
            <Box sx={{mt: 2}}>
                <Paper sx={{p: 2}}>
                    <Typography variant="h6" gutterBottom>
                        Zawartość pliku
                    </Typography>

                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.availability}
                                    disabled={true}
                                />
                            }
                            label="Dostępność"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.ean}
                                    disabled={true}
                                />
                            }
                            label="EAN (kod kreskowy)"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.wholesale_net_price}
                                    disabled={true}
                                />
                            }
                            label="Cena hurtowa netto (wyliczana dla klienta z uwzględnieniem jego rabatów)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.retail_gross_price}
                                    disabled={true}
                                />
                            }
                            label="Cena detaliczna brutto"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.description}
                                    disabled={true}
                                />
                            }
                            label="Opis"
                        />

                        <Typography variant="subtitle1" sx={{mt: 1}}>
                            Obrazy (dostępne tylko dla typu XML)
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.image_basic}
                                    disabled={true}
                                />
                            }
                            label="Zdjęcie podstawowy"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.image_square}
                                    disabled={true}
                                />
                            }
                            label="Zdjęcie kwadratowy"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!data.image_webp}
                                    disabled={true}
                                />
                            }
                            label="Zdjęcie WEBP"
                        />
                    </Box>
                </Paper>
            </Box>


            <Box sx={{mt: 2}}>
                <Paper sx={{p: 2}}>
                    <Typography variant="h6" gutterBottom>
                        Częstotliwość aktualizacji pliku
                    </Typography>
                    <TextField
                        type="text"
                        id="cron"
                        label="Częstotliwość"
                        variant={"outlined"}
                        value={data.cron}
                        disabled={true}
                        sx={{width: "30ch", my: 1}}
                    />
                    <Cron
                        value={data.cron}
                        setValue={() => {
                        }}
                        clearButton={false}
                        leadingZero={true}
                        shortcuts={false}
                        locale={POLISH_LOCALE}
                        className={"my-project-cron"}
                        disabled={true}
                    />
                </Paper>

            </Box>

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
