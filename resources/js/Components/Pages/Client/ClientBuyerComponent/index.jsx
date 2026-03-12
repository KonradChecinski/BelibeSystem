import {useEffect, useState} from "react";
import {router, useForm} from "@inertiajs/react";
import {
    Box,
    Button,
    Checkbox,
    Fade,
    FormControl,
    FormControlLabel,
    IconButton,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {Cancel, Euro, Save} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import ClientFindBuyerDialog from "@/Components/Dialogs/ClientDialog/ClientFindBuyerDialog";
import {enqueueSnackbar} from "notistack";

export default function ClientBuyerComponent(props) {
    const [edited, setEdited] = useState(false);
    const [buyerDialogOpen, setBuyerDialogOpen] = useState(false);

    const theme = useTheme();
    // console.log("Propsy: ", props)


    const {data, setData, processing, delete: destroy} = useForm({
        'id': props.client.id,
        'is_client_buyer': !props.client.buyer_subiekt_id,

        'buyer_subiekt_id': props.client.buyer_subiekt_id,
        'buyer_subiekt_name': props.client.buyer_subiekt_name,
    })

    useEffect(() => {
        setData({
            'id': props.client.id,
            'is_client_buyer': !props.client.buyer_subiekt_id,

            'buyer_subiekt_id': props.client.buyer_subiekt_id,
            'buyer_subiekt_name': props.client.buyer_subiekt_name,
        })
    }, [props]);


    const onSubmit = () => {
        deleteClientBuyer()
    }

    const resetForm = () => {
        setData({
            'id': props.client.id,
            'buyer_subiekt_id': props.client.buyer_subiekt_id,
            'buyer_subiekt_name': props.client.buyer_subiekt_name,
            'is_client_buyer': !props.client.buyer_subiekt_id,
        });
        setEdited(false);
    };
    const deleteClientBuyer = () => {
        // console.log(data)
        if (!!data.is_client_buyer) {
            destroy(route("system.clients.buyer.delete", {client: data.id}), {
                onSuccess: params => {
                    setEdited(false);
                    enqueueSnackbar("Usunięto nabywce", {variant: 'success'})
                    router.reload()
                    setEdited(false)
                },
                onError: params => {
                    console.error(params)
                    enqueueSnackbar("Błąd przy usuwaniu nabywcy", {variant: 'error'})
                },
                preserveScroll: true
            })
        }
    }

    return (
        <>
            {/*<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">*/}


            <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>

                <Box>

                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 5, mt: 2, flexDirection: "column"}}>
                        <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                            <Box>
                                <FormControl
                                    sx={{
                                        // ml: 2,
                                        width: "25ch",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <FormControlLabel
                                        label={<Typography>Klient jest nabywcą</Typography>}
                                        control={
                                            <Checkbox
                                                id="client-buyer-checkbox"
                                                label="Klient jest nabywcą"
                                                size={"large"}
                                                disabled={!props.editing}
                                                checked={data.is_client_buyer}
                                                onChange={(value) => {
                                                    setData("is_client_buyer", value.target.checked)
                                                    setEdited(true)
                                                }}
                                            />
                                        }
                                    />

                                </FormControl>
                            </Box>
                        </Box>
                        {!data.is_client_buyer && (
                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                <Box>
                                    <TextField id="id_subiekt" label="Id Subiekt" variant="outlined"
                                               value={props.client.buyer_subiekt_id ?? ""}
                                               disabled={true}
                                               sx={{
                                                   width: "9ch",
                                               }}/>
                                </Box>
                                <Box>
                                    <TextField id="id_subiekt" label="Nazwa w Subiekt" variant="outlined"
                                               value={props.client.buyer_subiekt_name ?? ""}
                                               disabled={true}
                                               InputProps={{
                                                   endAdornment: (
                                                       <>
                                                           {!data.buyer_subiekt_id && (
                                                               <Button
                                                                   variant="outlined"
                                                                   startIcon={<Euro/>}
                                                                   sx={{width: "40ch"}}
                                                                   onClick={() => setBuyerDialogOpen(true)}
                                                               >
                                                                   Ustaw nabywcę
                                                               </Button>
                                                           )}
                                                       </>

                                                   )
                                               }}
                                               sx={{
                                                   width: "60ch",
                                               }}/>
                                </Box>
                                <ClientFindBuyerDialog open={buyerDialogOpen} setOpen={setBuyerDialogOpen}
                                                       props={props} setEdited={setEdited}/>
                            </Box>
                        )}

                    </Box>
                </Box>


                <Fade in={edited}>
                    <Tooltip title={"Zapisz"}>
                        <IconButton
                            type="submit"
                            color="success"
                            size={"small"}
                            disabled={processing}
                            onClick={onSubmit}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 230,
                            }}>
                            <Save fontSize={"large"}/>
                        </IconButton>
                    </Tooltip>

                </Fade>
                <Fade in={edited}>
                    <Tooltip title={"Cofnij zmiany"}>
                        <IconButton
                            color="error"
                            size={"small"}
                            disabled={processing}
                            onClick={resetForm}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 280,
                            }}
                        >
                            <Cancel fontSize={"large"}/>
                        </IconButton>
                    </Tooltip>
                </Fade>
            </Box>
            {/*</form>*/}
        </>
    );
}
