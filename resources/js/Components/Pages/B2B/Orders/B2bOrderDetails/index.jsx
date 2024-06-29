import {Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import OrderItems from "@/Components/Pages/Orders/B2B/OrderDetails/OrderItems";
import OrderPayments from "@/Components/Pages/Orders/B2B/OrderDetails/OrderPayments";
import OrderDeliveries from "@/Components/Pages/Orders/B2B/OrderDetails/OrderDeliveries";
import OrderLocations from "@/Components/Pages/Orders/B2B/OrderDetails/OrderLocations";
import OrderComment from "@/Components/Pages/Orders/B2B/OrderDetails/OrderComment";
import OrderSummary from "@/Components/Pages/Orders/B2B/OrderDetails/OrderSummary";
import {useEffect, useState} from "react";
import {router} from "@inertiajs/react";


export default function B2bOrderDetails({row, open, handleClose}) {
    const [data, setData] = useState(null)

    const getData = () => {
        // router.get(route("b2b.order.show", {clientOrder: row.original.id}))
        axios.get(route("b2b.order.show", {clientOrder: row.original.id}))
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
                                <OrderLocations data={data}/>
                            </Box>
                            <OrderComment data={data}/>
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
