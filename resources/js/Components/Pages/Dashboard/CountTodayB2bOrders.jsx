import {Card, CardContent, Typography} from "@mui/material";


export default function CountTodayB2bOrders(props) {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">
                    Ilość zamówień B2B dzisiaj
                </Typography>
                <Typography variant="h2" textAlign={"center"}>
                    {props.ordersCount.b2b}
                </Typography>
            </CardContent>
        </Card>
    );
}
