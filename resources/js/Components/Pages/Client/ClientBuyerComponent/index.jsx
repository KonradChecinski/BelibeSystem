import {useEffect, useState} from "react";
import {router, useForm} from "@inertiajs/react";
import {
    Autocomplete,
    Box,
    Button, Checkbox, Divider,
    Fade, FormControl, FormControlLabel, IconButton,
    TextField, Tooltip,
    Typography
} from "@mui/material";
import {Cancel, CloudDownload, Save, Home, Phone, Handshake, Mail, Euro} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {useTheme} from "@mui/material/styles";
import {IdentityCard} from "@/Icons/IdentityCard";

export default function ClientBuyerComponent(props) {
    const [edited, setEdited] = useState(false);

    const theme = useTheme();
    // console.log("Propsy: ", props)


    const {data, setData, processing, post} = useForm({
        'id': props.client.id,
        'is_client_buyer': !props.client.buyer_subiekt_id,

        'buyer_subiekt_id': props.client.buyer_subiekt_id,
        'buyer_subiekt_name': props.client.buyer_subiekt_name,
    })


    const onSubmit = (formData, e) => {
        e.preventDefault()
        saveClientBuyer()
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
    const saveClientBuyer = () => {
        // post(route("system.clients.client.update.basic", {client: data.id}), {
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
        <>
            {/*<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">*/}


            <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>

                <Box>

                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 5, mt: 2, flexDirection: "column"}}>
                        <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                            <Box>
                                {/*<TextField id="id_subiekt" label="Id w Subiekt" variant="outlined"*/}
                                {/*           value={props.client.subiekt_id ? props.client.subiekt_id : "Brak"}*/}
                                {/*           color={props.client.subiekt_id === null ? "error" : null}*/}
                                {/*           error={props.client.subiekt_id === null}*/}
                                {/*           disabled={true}*/}
                                {/*           InputProps={{*/}
                                {/*               readOnly: true,*/}
                                {/*               endAdornment: (*/}
                                {/*                   <>*/}
                                {/*                       {props.editing && (*/}
                                {/*                           <Tooltip*/}
                                {/*                               title={Boolean(props.client.subiekt_id) ? "Client jest połączony z Subiektem" : "Połącz do Subiekta"}*/}
                                {/*                           >*/}
                                {/*                                    <span>*/}
                                {/*                                        <IconButton*/}
                                {/*                                            disabled={Boolean(props.client.subiekt_id)}*/}
                                {/*                                            onClick={() => {*/}
                                {/*                                                router.post(route("system.clients.client.update.basic.subiekt", {client: props.client.id}),*/}
                                {/*                                                    {}, {*/}
                                {/*                                                        preserveScroll: true,*/}
                                {/*                                                        onSuccess: () => {*/}
                                {/*                                                            enqueueSnackbar("Powiązano klienta z Subiektem", {variant: 'success'})*/}
                                {/*                                                            // router.reload()*/}
                                {/*                                                        },*/}
                                {/*                                                        onError: errors => {*/}
                                {/*                                                            console.error(errors)*/}
                                {/*                                                            enqueueSnackbar("Błąd przy powiązaniu klienta z Subiektem", {variant: 'error'})*/}
                                {/*                                                            for (const errorsKey in errors) {*/}
                                {/*                                                                enqueueSnackbar(errors[errorsKey], {variant: 'error'})*/}
                                {/*                                                            }*/}
                                {/*                                                        },*/}
                                {/*                                                    }*/}
                                {/*                                                )*/}
                                {/*                                            }}*/}
                                {/*                                        >*/}
                                {/*                                            <IdentityCard fontSize={"large"}/>*/}
                                {/*                                        </IconButton>*/}
                                {/*                                    </span>*/}
                                {/*                           </Tooltip>*/}

                                {/*                       )}*/}
                                {/*                   </>*/}
                                {/*               )*/}
                                {/*           }}*/}
                                {/*           sx={{*/}
                                {/*               width: "16ch",*/}
                                {/*               '& .MuiOutlinedInput-notchedOutline': {*/}
                                {/*                   borderColor: props.client.subiekt_id === null ? `${theme.palette.error.main} !important` : '',*/}
                                {/*               },*/}
                                {/*           }}/>*/}
                            </Box>


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
                                                                   // onClick={() => router.visit(route("system.clients.client.emails", {client: props.client.id}))}
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
