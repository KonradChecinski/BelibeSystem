import {Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useEffect, useState} from "react";
import OrderPaymentsEdit
    from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderDetailsEdit/OrderPaymentsEdit";
import OrderDeliveriesEdit
    from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderDetailsEdit/OrderDeliveriesEdit";
import OrderLocationsEdit
    from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderDetailsEdit/OrderLocationsEdit";
import OrderCommentEdit from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderDetailsEdit/OrderCommentEdit";
import OrderSummaryEdit from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderDetailsEdit/OrderSummaryEdit";
import OrderItemsEdit from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderDetailsEdit/OrderItemsEdit";


export default function OrderDetailsEdit({row, open, handleClose}) {
    const [data, setData] = useState(null)

    const getData = () => {
        // router.get(route("system.b2b.order", {clientOrder: row.original.id}))
        axios.get(route("system.b2b.order", {clientOrder: row.original.id}))
            .then(response => {
                setData(response.data)
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
            <DialogTitle>Edycja zamówienia - {row?.original?.number}</DialogTitle>
            <DialogContent>
                {data ?
                    (
                        <>
                            <OrderItemsEdit data={data}/>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                gap: 2,
                                my: 2,
                            }}>
                                <OrderPaymentsEdit data={data}/>
                                <OrderDeliveriesEdit data={data}/>
                                <OrderLocationsEdit data={data}/>
                            </Box>
                            <OrderCommentEdit data={data}/>
                            <OrderSummaryEdit data={data}/>

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
                <Button onClick={handleClose}>Zapisz</Button>
            </DialogActions>
        </Dialog>

    );
}
