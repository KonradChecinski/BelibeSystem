import {Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import OrderItems from "@/Components/Pages/Orders/Other/OrderDetails/OrderItems";
import OrderPayments from "@/Components/Pages/Orders/Other/OrderDetails/OrderPayments";
import OrderDeliveries from "@/Components/Pages/Orders/Other/OrderDetails/OrderDeliveries";
import OrderLocations from "@/Components/Pages/Orders/Other/OrderDetails/OrderLocations";
import OrderSummary from "@/Components/Pages/Orders/Other/OrderDetails/OrderSummary";
import {useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import OrderCode from "@/Components/Pages/Orders/Other/OrderDetails/OrderCode";


export default function OrderDetails({row, open, handleClose}) {
    const [data, setData] = useState(null)

    const getData = () => {
        // router.get(route("system.orders.order.other", {order: row.original.id}))
        axios.get(route("system.orders.order.other", {order: row.original.id}))
            .then(response => {
                setData(response.data)
                console.log(response.data)
            })
            .catch(error => {
                console.error(error)
            });
    }


    useEffect(() => {
        if (open === true && data === null) {
            getData()
        }
    }, [open]);


    return (
        <Dialog
            fullWidth={true}
            maxWidth={"xl"}
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Szczegóły zamówienia - {row?.original?.number}</DialogTitle>
            <DialogContent>
                {data ?
                    (
                        <>
                            <OrderItems data={data}/>
                            <OrderLocations data={data}/>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                gap: 2,
                                my: 2,
                            }}>
                                <OrderPayments data={data}/>
                                <OrderDeliveries data={data}/>
                                <OrderCode data={data}/>
                            </Box>
                            <OrderSummary data={data}/>

                        </>
                    )
                    :
                    (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                m: 'auto',
                                width: 'fit-content',
                            }}
                        >
                            <CircularProgress/>
                        </Box>


                    )}

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Zamknij</Button>
            </DialogActions>
        </Dialog>

    );
}
