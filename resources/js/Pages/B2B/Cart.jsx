import {Head, Link, router, useForm} from "@inertiajs/react";
import {Fragment, useCallback, useMemo, useState} from "react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box, Button, Card, CardActionArea, CardActions, CardContent,
    debounce, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import {sortBySizesModelColorObject, sortBySizesSortFunction} from "@/Functions/sortBySizes";
import toLocaleString from "@/Functions/toLocaleString";
import {Delete, Edit, LocalShipping, Payment} from "@mui/icons-material";
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

    const [paymentDiscount, setPaymentDiscount] = useState(0);

    const {data, setData} = useForm({
        payment: null,
        delivery: null,
        location: null,
    });

    return (
        <ClientLayout
            auth={props.auth}
            errors={props.errors}
            categories={props.menu}
            bgImage={props.backgroundImage}
            accountManager={props.accountManager}
            cart={props.cartSummary}
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
                <CartSummary props={props} paymentDiscount={paymentDiscount}/>
                <CartSubmit props={props} data={data}/>
            </Box>
        </ClientLayout>
    );
}
