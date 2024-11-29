import {enqueueSnackbar, useSnackbar} from "notistack";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import {Send} from "@mui/icons-material";

export default function CartSubmit({props, data, setData, post, processing}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();


    const send = () => {
        if (!data.payment) {
            enqueueSnackbar("Proszę wybrać metodę płatności", {variant: 'info'})
            return
        }
        if (!data.delivery) {
            enqueueSnackbar("Proszę wybrać metodę dostawy", {variant: 'info'})
            return
        }
        if (!data.location) {
            enqueueSnackbar("Proszę wybrać adres dostawy", {variant: 'info'})
            return
        }


        post(route("b2b.order.store"),
            {
                preserveScroll: true,
                onSuccess: (e) => {
                    enqueueSnackbar("Zamówienie zostało złożone", {variant: 'success'})
                },
                onError: errors => {
                    enqueueSnackbar("Wystąpił błąd podczas składania zamówienia", {variant: 'error'})
                    if (errors[403]) enqueueSnackbar(errors[403].message, {variant: 'error'})

                    console.error(errors)
                },
            })
    }

    return (
        <Paper sx={{my: 2, p: 2}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 2}}>
                <Send sx={{
                    width: 40,
                    height: 40,
                }}/>
                <Typography variant="h5">
                    Potwierdzenie
                </Typography>
            </Box>
            <Box sx={{display: "flex", gap: 2, flexWrap: "wrap"}}>
                <Box sx={{width: 1}}>
                    <Typography variant="body1">
                        Uwagi dla sprzedawcy {props.accountManager ? "(Od klienta)" : null}
                    </Typography>
                    <TextField
                        id="outlined-basic"
                        // label="Komentarz"
                        variant="outlined"
                        multiline={true}
                        value={data.client_comment}
                        onChange={(e) => setData("client_comment", e.target.value)}
                        minRows={4}
                        sx={{
                            width: 1,
                            minWidth: "30ch",
                            maxWidth: "50ch",
                            mt: 2,
                            mb: 4
                        }}
                    />

                </Box>
                {props.accountManager &&
                    (
                        <Box sx={{width: 1}}>
                            <Typography variant="body1">
                                Uwagi systemowe (klient ich nie widzi)
                            </Typography>
                            <TextField
                                id="outlined-basic"
                                // label="Komentarz"
                                variant="outlined"
                                multiline={true}
                                value={data.user_comment}
                                onChange={(e) => setData("user_comment", e.target.value)}
                                minRows={4}
                                sx={{
                                    width: 1,
                                    minWidth: "30ch",
                                    maxWidth: "50ch",
                                    mt: 2,
                                    mb: 4
                                }}
                            />

                        </Box>
                    )
                }

            </Box>

            <Box sx={{display: "flex", gap: 2, justifyContent: "space-between"}}>
                <Box>
                    <Typography variant="caption">
                        Klikając w przycisk "Zamów" potwierdzasz zamówienie. Zamówienie zostanie przekazane do
                        weryfikacji, a produkty zostaną zarezerwowane.
                    </Typography>
                </Box>
                <Box>
                    <Button variant="outlined" size={"large"} endIcon={<Send/>} onClick={send} disabled={processing}>
                        Zamów
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
