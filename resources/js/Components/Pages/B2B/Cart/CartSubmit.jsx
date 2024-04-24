import {useSnackbar} from "notistack";
import {Box, Button, Paper, Typography} from "@mui/material";
import {Send} from "@mui/icons-material";

export default function CartSubmit({props, data, post}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

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
            <Box sx={{display: "flex", gap: 2, justifyContent: "space-between"}}>
                <Box>
                    <Typography variant="caption">
                        Klikając w przycisk "Zamawiam" potwierdzasz zamówienie. Zamówienie zostanie przekazane do
                        realizacji.
                    </Typography>
                </Box>
                <Box>
                    <Button variant="outlined" size={"large"} endIcon={<Send/>}>
                        Zamów
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
