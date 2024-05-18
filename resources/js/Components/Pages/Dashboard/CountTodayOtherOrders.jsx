import {Card, CardContent, Typography} from "@mui/material";


export default function CountTodayOtherOrders(props) {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">
                    Ilość innych zamówień dzisiaj
                </Typography>
                <Typography variant="h2" textAlign={"center"}>
                    {props.ordersCount.other}
                </Typography>
            </CardContent>
        </Card>
    );
}
