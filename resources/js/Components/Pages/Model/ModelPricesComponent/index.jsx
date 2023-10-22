import {
    Button, Fade,
    FormControl,
    FormHelperText, IconButton,
    InputAdornment, OutlinedInput,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import toLocaleString from "@/Functions/toLocaleString";
import {useTheme} from "@mui/material/styles";
import {useForm} from "@inertiajs/react";
import {useState} from "react";
import {Save} from "@mui/icons-material";
import {enqueueSnackbar} from 'notistack';

export default function ModelPricesComponent(props) {

    return (
        <>
            {props.editing ?
                <ModelPricesComponentEdit {...props}/>
                :
                <ModelPricesComponentShow {...props}/>
            }
        </>
    );


}


function ModelPricesComponentShow(props) {
    const {data} = useForm({
        'wholesale_net_price': props.productModel.prices.wholesale_net_price,
        'wholesale_gross_price': props.productModel.prices.wholesale_gross_price,
        'retail_net_price': props.productModel.prices.retail_net_price,
        'retail_gross_price': props.productModel.prices.retail_gross_price,
        'vat_rate': props.productModel.prices.vat_rate,
    })

    function currencyNumberPrice(number) {
        return (Number(number / 100).toLocaleString(undefined, {minimumFractionDigits: 2}) + " " + props.productModel.prices.currency);
    }

    const theme = useTheme();
    return (
        <>
            <TableContainer component={Paper} elevation={5}>
                <Table aria-label="price table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Cena</TableCell>
                            <TableCell>Cena Netto</TableCell>
                            <TableCell>Cena Brutto</TableCell>
                            <TableCell>Stawka VAT</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{
                        '.MuiTableRow-root:nth-of-type(odd)': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}>
                        <TableRow>
                            <TableCell>Hurtowa</TableCell>
                            <TableCell>{currencyNumberPrice(data.wholesale_net_price)}</TableCell>
                            <TableCell>{currencyNumberPrice(data.wholesale_gross_price)}</TableCell>
                            <TableCell>{props.productModel.prices.vat_rate} %</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Detaliczna</TableCell>
                            <TableCell>{currencyNumberPrice(data.retail_net_price)}</TableCell>
                            <TableCell>{currencyNumberPrice(data.retail_gross_price)}</TableCell>
                            <TableCell>{props.productModel.prices.vat_rate} %</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

function ModelPricesComponentEdit(props) {
    const [edited, setEdited] = useState(false);
    const {data, setData, processing, post} = useForm({
        'id': props.productModel.prices.id,
        'product_model_id': props.productModel.prices.product_model_id,
        'wholesale_net_price': props.productModel.prices.wholesale_net_price,
        'wholesale_gross_price': props.productModel.prices.wholesale_gross_price,
        'retail_net_price': props.productModel.prices.retail_net_price,
        'retail_gross_price': props.productModel.prices.retail_gross_price,
        'vat_rate': props.productModel.prices.vat_rate,
        'currency': props.productModel.prices.currency,
    })

    const savePrice = () => {
        post(route("system.products.model.price", {productModelPrice: data.id}), {
            preserveScroll: true,
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano ceny", {variant: 'success'})
            },
            onError: params => {
                console.error(params);
                enqueueSnackbar("Błąd", {variant: 'error'})
            },
        })
    }

    const theme = useTheme();
    return (
        <>
            <TableContainer component={Paper} elevation={5}>
                <Table aria-label="price table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Cena</TableCell>
                            <TableCell>Cena Netto</TableCell>
                            <TableCell>Cena Brutto</TableCell>
                            <TableCell>Stawka VAT</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{
                        '.MuiTableRow-root:nth-of-type(odd)': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}>
                        <TableRow>
                            <TableCell>Hurtowa</TableCell>
                            <TableCell>
                                <PriceFiled
                                    currency={data.currency}
                                    price={data.wholesale_net_price}
                                    setPrice={(price) => {
                                        setData(data => ({...data, wholesale_net_price: price}))
                                        setData(data => ({
                                            ...data,
                                            wholesale_gross_price: Number(price * (1 + data.vat_rate / 100)).toFixed()
                                        }))
                                        setEdited(true);
                                    }}/>
                            </TableCell>
                            <TableCell>
                                <PriceFiled
                                    currency={data.currency}
                                    price={(data.wholesale_gross_price)}
                                    setPrice={(price) => {
                                        setData(data => ({...data, wholesale_gross_price: price}))
                                        setData(data => ({
                                            ...data,
                                            wholesale_net_price: Number(price / (1 + data.vat_rate / 100)).toFixed()
                                        }))
                                        setEdited(true);
                                    }}/>
                            </TableCell>
                            <TableCell>
                                <VatFiled vat={data.vat_rate} setVat={(vat) => {
                                    setData(data => ({...data, vat_rate: vat}))
                                    setData(data => ({
                                        ...data,
                                        wholesale_gross_price: Number(data.wholesale_net_price * (1 + data.vat_rate / 100)).toFixed()
                                    }))
                                    setData(data => ({
                                        ...data,
                                        retail_gross_price: Number(data.retail_net_price * (1 + data.vat_rate / 100)).toFixed()
                                    }))
                                    setEdited(true);
                                }}/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Detaliczna</TableCell>
                            <TableCell>
                                <PriceFiled
                                    currency={data.currency}
                                    price={(data.retail_net_price)}
                                    setPrice={(price) => {
                                        setData(data => ({...data, retail_net_price: price}))
                                        setData(data => ({
                                            ...data,
                                            retail_gross_price: Number(price * (1 + data.vat_rate / 100)).toFixed()
                                        }))
                                        setEdited(true);
                                    }}/>
                            </TableCell>
                            <TableCell>
                                <PriceFiled
                                    currency={data.currency}
                                    price={(data.retail_gross_price)}
                                    setPrice={(price) => {
                                        setData(data => ({...data, retail_gross_price: price}))
                                        setData(data => ({
                                            ...data,
                                            retail_net_price: Number(price / (1 + data.vat_rate / 100)).toFixed()
                                        }))
                                        setEdited(true);
                                    }}/>
                            </TableCell>
                            <TableCell>
                                <VatFiled vat={data.vat_rate} setVat={(vat) => {
                                    setData(data => ({...data, vat_rate: vat}))
                                    setData(data => ({
                                        ...data,
                                        wholesale_gross_price: data.wholesale_net_price * (1 + data.vat_rate / 100)
                                    }))
                                    setData(data => ({
                                        ...data,
                                        retail_gross_price: Number(data.retail_net_price * (1 + data.vat_rate / 100)).toFixed()
                                    }))
                                    setEdited(true);
                                }}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Fade in={edited}>
                <Button variant="outlined" startIcon={<Save/>} disabled={processing}
                        onClick={savePrice}
                        sx={{
                            position: "absolute",
                            top: 7,
                            right: 100,
                        }}>
                    Zapisz
                </Button>
            </Fade>

        </>
    );
}

function PriceFiled({price, setPrice, currency}) {
    let newPrice = numberPrice(price)

    const onKeyPress = (event) => {
        const regex = /^[0-9\b]+$/;

        const key = event.key;
        const keyCode = event.keyCode;

        let oldValue = event.target.defaultValue.replace(/,/g, "").replace(/\./g, "");
        let value = "";

        if (regex.test(key)) {
            value = "" + oldValue + key
            setPrice(value)
        } else if (keyCode === 8) {
            value = oldValue.slice(0, -1)
            setPrice(value)
        }
    }


    function numberPrice(number) {
        return (Number(number / 100).toLocaleString(undefined, {minimumFractionDigits: 2, useGrouping: false}));
    }

    return (
        <FormControl sx={{m: 0, width: '25ch'}} variant="outlined">
            <OutlinedInput
                id="outlined-adornment-weight"
                endAdornment={<InputAdornment
                    position="end">{currency}</InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                onKeyDown={onKeyPress}
                value={newPrice}

            />
        </FormControl>
    );
}

function VatFiled({vat, setVat}) {

    const onKeyPress = (event) => {
        const regex = /^[0-9\b]+$/;

        const key = event.key;
        const keyCode = event.keyCode;

        let oldValue = event.target.defaultValue.replace(/,/g, "").replace(/\./g, "");
        let value = "";

        if (regex.test(key)) {
            value = "" + oldValue + key
            setVat(value)
        } else if (keyCode === 8) {
            value = oldValue.slice(0, -1)
            setVat(value)
        }
    }


    return (
        <FormControl sx={{m: 0, width: '25ch'}} variant="outlined">
            <OutlinedInput
                id="outlined-adornment-weight"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                onKeyDown={onKeyPress}
                value={vat}

            />
        </FormControl>
    );
}
