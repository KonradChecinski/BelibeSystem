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

    const handleDeliveryChange = (delivery) => {
        setDeliveryMethod(delivery.id);
        setData("delivery", delivery)
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
                {props.deliveries.map((delivery) => {

                    return (
                        <Card variant="outlined"
                              key={delivery.id}
                              sx={{
                                  width: 400,
                                  height: 130,
                                  bgcolor: deliveryMethod === delivery.id ? "successBg.main" : ""
                              }}>
                            <CardActionArea sx={{width: 1, height: 1}} onClick={() => handleDeliveryChange(delivery)}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {delivery.name}
                                    </Typography>
                                    <Typography variant="body1">
                                        {delivery.description}
                                    </Typography>
                                    {
                                        props.cartPriceSummary.total_net <= delivery.free_from ?
                                            (
                                                <Typography variant="body2">
                                                    Koszt: {toLocaleString(delivery.price_net / 100)} ({toLocaleString(delivery.price_gross / 100)} Brutto)
                                                </Typography>
                                            )
                                            :
                                            (
                                                <Typography variant="body2">
                                                    Koszt: {toLocaleString(0)} ({toLocaleString(0)} Brutto)
                                                </Typography>
                                            )
                                    }

                                    <Typography variant="body2">
                                        Czas dostawy: {delivery.delivery_time_min} - {delivery.delivery_time_max}
                                    </Typography>
                                    {props.cartPriceSummary.total_net <= delivery.free_from &&
                                        (
                                            <Typography variant="body2">
                                                Dostawa za darmo po
                                                przekroczeniu {toLocaleString(delivery.free_from / 100)} Netto
                                            </Typography>
                                        )
                                    }
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )
                })}
            </Box>


        </Paper>
    );
}
