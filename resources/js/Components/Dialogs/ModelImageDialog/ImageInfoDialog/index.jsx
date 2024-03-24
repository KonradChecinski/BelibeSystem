import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Radio, RadioGroup,
    Step,
    StepLabel,
    Stepper, Switch,
    TextField
} from "@mui/material";
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useState, useRef, useEffect} from "react";
import Draggable from "react-draggable";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import moment from "moment";

export default function ImagesInfoDialog({open, setOpen, image, props}) {

    const {data, setData, patch, processing, transform} = useForm({
        publish: image.publish,
        main: image.main
    })


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const save = () => {
        // console.log(image)

        patch(route("system.products.images.update.publish", {productImage: image.id}),

            {
                preserveScroll: true,
                onSuccess: (e) => {
                    enqueueSnackbar("Zmieniono udostępnienie", {variant: 'success'})
                    handleClose()
                },
                onError: errors => {
                    enqueueSnackbar("Błąd przy zmianie udostępnienia", {variant: 'error'})
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
                Zdjęcie
            </DialogTitle>
            <DialogContent>
                <img src={route("images", {path: image.path})} alt={"Usuwane zdjęcie"} className={"h-48"}/>
                <DialogContentText>
                    Wymiary [S x W]: {image.width} x {image.height} ({aspectRatio(image.width, image.height)})
                </DialogContentText>
                {image.type === 1 ?
                    <>
                        <DialogContentText>
                            Udostępnione:

                            <Switch color={"secondary"} checked={Boolean(data.publish)} onChange={(e, value) => {
                                setData("publish", value)
                            }}
                                    disabled={processing}/>

                        </DialogContentText>
                        <DialogContentText>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Zdjęcie główne</FormLabel>
                                <RadioGroup
                                    aria-label="season"
                                    // defaultValue="0"
                                    value={data.main}
                                    onChange={(e, value) => {
                                        setData("main", e.target.value)
                                    }}
                                    name="mainImages"
                                    sx={{ml: 5}}
                                >
                                    <FormControlLabel
                                        value={0}
                                        control={<Radio/>}
                                        label="Nie jest zdjęciem głównym"
                                    />
                                    <FormControlLabel
                                        value={1}
                                        control={<Radio/>}
                                        label="Pierwsze"
                                    />
                                    <FormControlLabel
                                        value={2}
                                        control={<Radio/>}
                                        label="Drugie"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </DialogContentText>
                    </>
                    : ""
                }

                <DialogContentText>
                    Ścieżka na dysku: {image.path.replaceAll("\\\\", "/").replaceAll("\\", "/")}
                </DialogContentText>
                <DialogContentText>
                    Data utworzenia: {moment(image.created_at).calendar()}
                </DialogContentText>
                <DialogContentText>
                    Data ostatniej aktualizacji: {moment(image.updated_at).calendar()}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Zamknij
                </Button>


                <Button onClick={save} disabled={processing}>
                    Zapisz
                </Button>
            </DialogActions>

        </Dialog>

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

function aspectRatio(width, height) {

    const gcd = (...arr) => {
        const _gcd = (x, y) => (!y ? x : gcd(y, x % y));
        return [...arr].reduce((a, b) => _gcd(a, b));
    };

    const gcdResult = gcd(width, height);

    return `${width / gcdResult}:${height / gcdResult}`;
}
