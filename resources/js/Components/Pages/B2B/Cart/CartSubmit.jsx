import {enqueueSnackbar, useSnackbar} from "notistack";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import {Send} from "@mui/icons-material";

export default function CartSubmit({props, data, setData, post}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const canSend = () => {
        return data.payment && data.delivery && data.location
    }
    const send = () => {
        if (canSend()) {
            post(route("b2b.order.store"),
                {
                    preserveScroll: true,
                    onSuccess: (e) => {
                        enqueueSnackbar("Zamówienie zostało złożone", {variant: 'success'})
                    },
                    onError: errors => {
                        enqueueSnackbar("Wystąpił błąd podczas składania zamówienia", {variant: 'error'})
                        console.error(errors)
                    },
                })
        } else {
            enqueueSnackbar("Proszę wybrać metodę płatności, dostawy i adres dostawy", {variant: 'info'})
        }
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
            <Box>
                <Typography variant="body1">
                    Uwagi dla sprzedawcy
                </Typography>
                <TextField
                    id="outlined-basic"
                    // label="Komentarz"
                    variant="outlined"
                    multiline={true}
                    value={data.comment}
                    onChange={(e) => setData("comment", e.target.value)}
                    minRows={4}
                    sx={{
                        width: "50ch",
                        minWidth: "30ch",
                        maxWidth: "50ch",
                        mt: 2,
                        mb: 4
                    }}
                />

            </Box>
            <Box sx={{display: "flex", gap: 2, justifyContent: "space-between"}}>
                <Box>
                    <Typography variant="caption">
                        Klikając w przycisk "Zamawiam" potwierdzasz zamówienie. Zamówienie zostanie przekazane do
                        weryfikacji, a produkty zostaną zarezerwowane.
                    </Typography>
                </Box>
                <Box>
                    <Button variant="outlined" size={"large"} endIcon={<Send/>} onClick={send}>
                        Zamów
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
