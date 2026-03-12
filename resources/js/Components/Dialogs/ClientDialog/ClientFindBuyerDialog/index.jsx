import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import Draggable from "react-draggable";
import {router, useForm} from "@inertiajs/react";
import {
    useClientFindBuyerForm
} from "@/Components/Dialogs/ClientDialog/ClientFindBuyerDialog/form/useClientFindBuyerForm";
import {enqueueSnackbar} from "notistack";

export default function ClientFindBuyerDialog({
                                                  open,
                                                  setOpen,
                                                  props,
                                                  setEdited
                                              }) {
    const {
        register,
        handleSubmit,
        errors: fieldErrors,
        setValue,
        clearErrors: clrErrors,
    } = useClientFindBuyerForm();


    const {data, setData, patch, processing, errors} = useForm({
        buyer_subiekt_id: null,
    })

    const [dataLoaded, setDataLoaded] = useState(false);
    const [buyerList, setBuyerList] = useState([]);

    useEffect(() => {
        if (!dataLoaded && open) {
            getBuyerList()
        }
    }, [open]);


    const getBuyerList = () => {
        axios.get(route('system.clients.findBuyers'),
            {
                headers: {
                    // 'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            },
        )
            .then(response => {
                // console.log(response.data);
                setBuyerList(response.data)
                setDataLoaded(true);
            })
            .catch(error => {
                enqueueSnackbar("Błąd przy pobieraniu danych klientów", {variant: 'error'})
                console.error(error)
            });

    }
    const onSubmit = (data, e) => {
        e.preventDefault();
        save()
    }
    const onError = (data, e) => {
        e.preventDefault();
        console.error("Błędne dane", data)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const save = () => {
        patch(route("system.clients.buyer.update", {client: props.client.id}), {
            onSuccess: params => {
                enqueueSnackbar("Zapisano nabywcę", {variant: 'success'})
                router.reload()
                setOpen(false);
                setEdited(false)
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy zapisywaniu nabywcy", {variant: 'error'})
                for (const errorsKey in errors) {
                    enqueueSnackbar(errors[errorsKey].toString(), {variant: 'error'})
                }
            },
            preserveScroll: true
        })
    }

    const selectedBuyer = buyerList.find(
        (item) => item.buyer_subiekt_id === data.buyer_subiekt_id
    ) ?? null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
            // fullWidth
            maxWidth="lg"
        >

            <form onSubmit={handleSubmit(onSubmit, onError)} autoComplete="off">

                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    {"Wybierz nabywcę z Subiekta"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{display: "flex", flexDirection: "column", minWidth: 500, pt: 1}}>
                        <Autocomplete
                            options={buyerList}
                            value={selectedBuyer}
                            onChange={(event, newValue) => {
                                setData(
                                    'buyer_subiekt_id',
                                    newValue ? newValue.buyer_subiekt_id : null
                                );
                                setValue('buyer_subiekt_id',
                                    newValue ? newValue.buyer_subiekt_id : null)
                            }}
                            isOptionEqualToValue={(option, value) =>
                                option.buyer_subiekt_id === value.buyer_subiekt_id
                            }
                            getOptionLabel={(option) => option?.buyer_subiekt_name ?? ""}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Nabywca"
                                    placeholder="Wyszukaj nabywcę"
                                />
                            )}
                        />
                        {fieldErrors.buyer_subiekt_id?.message && (
                            <Typography variant="body2" color="error" sx={{m: 1}}>
                                {fieldErrors.buyer_subiekt_id?.message.toString()}
                            </Typography>
                        )}
                    </Box>
                    {Object.keys(errors).map((key, index) => {
                        return (<Typography variant="body2" color={"error"} align={"center"} gutterBottom key={index}>
                            {errors[key]}
                        </Typography>)

                    })}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Zamknij
                    </Button>

                    <Button type="submit" disabled={processing}>
                        Zapisz
                    </Button>
                </DialogActions>

            </form>
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

