import {Card, CardContent, Typography} from "@mui/material";


export default function CountTodayOrders(props) {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">
                    Ilość zamówień dzisiaj
                </Typography>
                <Typography variant="h2" textAlign={"center"}>
                    {props.ordersCount.b2b + props.ordersCount.other}
                </Typography>
            </CardContent>
        </Card>
    );
}
