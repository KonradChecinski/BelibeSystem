import {useSnackbar} from "notistack";
import {
    Box,
    Card, CardActionArea, CardContent,
    Paper,
    Typography
} from "@mui/material";
import {Payment} from "@mui/icons-material";
import {useState} from "react";

export default function CartPayments({props, setPaymentDiscount, setData}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [paymentMethod, setPaymentMethod] = useState(0);

    const handlePaymentChange = (payment) => {
        setPaymentMethod(payment.id);
        if (payment.discount.discount_value > 0 && payment.discount.discount) {
            setPaymentDiscount(payment.discount.discount_value);
        } else {
            setPaymentDiscount(0);
        }
        setData("payment", payment);

    }

    return (
        <Paper sx={{my: 2, p: 2}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 2}}>
                <Payment sx={{
                    width: 40,
                    height: 40,
                }}/>
                <Typography variant="h5">
                    Płatność
                </Typography>
            </Box>
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                {props.payments.map((payment) => {


                    return (
                        <Card variant="outlined"
                              key={payment.id}
                              sx={{
                                  width: 300,
                                  height: 100,
                                  bgcolor: paymentMethod === payment.id ? "successBg.main" : ""
                              }}>
                            <CardActionArea sx={{width: 1, height: 1}}
                                            onClick={() => handlePaymentChange(payment)}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {payment.name}
                                    </Typography>
                                    {/*<Typography variant="body2" gutterBottom>*/}
                                    {/*    Koszt: {toLocaleString(props.cartPriceSummary.delivery_net / 100)} ({toLocaleString(props.cartPriceSummary.delivery_gross / 100)} Brutto)*/}
                                    {/*</Typography>*/}

                                    {payment.discount.discount_value > 0 && payment.discount.discount ? (
                                        <Typography variant="body2" gutterBottom>
                                            Rabat: {payment.discount.discount_value}%
                                        </Typography>
                                    ) : ""}

                                </CardContent>
                            </CardActionArea>
                        </Card>
                    );

                })}

            </Box>


        </Paper>
    );
}
