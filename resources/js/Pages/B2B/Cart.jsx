import {Head, Link, router, useForm} from "@inertiajs/react";
import {Fragment, useCallback, useMemo, useState} from "react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import CartItems from "@/Components/Pages/B2B/Cart/CartItems";
import CartSummary from "@/Components/Pages/B2B/Cart/cartSummary";
import CartPayments from "@/Components/Pages/B2B/Cart/cartPayments";
import CartDeliveries from "@/Components/Pages/B2B/Cart/cartDeliveries";
import CartLocations from "@/Components/Pages/B2B/Cart/CartLocations";
import CartSubmit from "@/Components/Pages/B2B/Cart/CartSubmit";

export default function B2bCart(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const [openReloadDialog, setOpenReloadDialog] = useState(false);

    const [paymentDiscount, setPaymentDiscount] = useState(0);

    const {data, setData, post} = useForm({
        payment: null,
        delivery: null,
        location: null,
        comment: "",
    });

    Echo.private("cart." + props.clientId + ".updated").listen("CartUpdated", (e) => {
        setOpenReloadDialog(true);
    });

    const reloadPage = () => {
        router.reload({only: ['cart', 'cartColors', 'cartModels', 'cartPriceSummary', 'cartSummary']})
        setTimeout(() => {
            setOpenReloadDialog(false)
        }, 1000)
    }

    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            accountManager={props.accountManager}
            cart={props.cartSummary}
            clientId={props.clientId}
            header={
                t("Cart")
            }
        >
            <Head title={t("Cart")}/>

            <Box sx={{width: 1, minHeight: 400, position: "relative", pb: 3}}>
                <CartItems props={props}/>
                <CartPayments props={props} setPaymentDiscount={setPaymentDiscount} setData={setData}/>
                <CartDeliveries props={props} setData={setData}/>
                <CartLocations props={props} setData={setData}/>
                <CartSummary props={props} data={data} paymentDiscount={paymentDiscount}/>
                <CartSubmit props={props} data={data} setData={setData} post={post}/>
            </Box>
            <Dialog
                open={openReloadDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Koszyk został zaktualizowany
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Produkty w koszyku zostały zaktualizowane. Musisz odświeżyć stronę, aby zobaczyć zmiany.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {/*<Button>Disagree</Button>*/}
                    <Button autoFocus onClick={reloadPage}>Odśwież</Button>
                </DialogActions>
            </Dialog>


        </ClientLayout>
    );
}
