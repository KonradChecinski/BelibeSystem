import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {LocalShipping} from "@mui/icons-material";
import {useState} from "react";

export default function CartDeliveries({props, setData}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [deliveryMethod, setDeliveryMethod] = useState(0);

    const handleDeliveryChange = (deliveryId) => {
        setDeliveryMethod(deliveryId);
        setData("delivery", deliveryId)
    }

    return (
        <Paper sx={{my: 2, p: 2}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 2}}>
                <LocalShipping sx={{
                    width: 40,
                    height: 40,
                }}/>
                <Typography variant="h5">
                    Dostawa
                </Typography>
            </Box>
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                <Card variant="outlined"
                      sx={{width: 400, height: 100, bgcolor: deliveryMethod === 1 ? "successBg.main" : ""}}>
                    <CardActionArea sx={{width: 1, height: 1}} onClick={() => setDeliveryMethod(1)}>
                        <CardContent>
                            <Typography variant="h6">
                                Dostawa kurierem
                            </Typography>
                            <Typography variant="body1">
                                Dostawa kurierem GLS
                            </Typography>
                            <Typography variant="body2">
                                Koszt: {toLocaleString(props.cartPriceSummary.delivery_net / 100)} ({toLocaleString(props.cartPriceSummary.delivery_gross / 100)} Brutto)
                            </Typography>
                            {props.cartPriceSummary.total_net <= 50000 &&
                                (
                                    <Typography variant="body2">
                                        Dostawa za darmo po przekroczeniu 500 zł Netto
                                    </Typography>
                                )
                            }
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Box>


        </Paper>
    );
}
