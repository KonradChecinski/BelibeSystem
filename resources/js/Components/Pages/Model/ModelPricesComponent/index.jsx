import {
    FormControl,
    FormHelperText,
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


    function currencyNumberPrice(number) {
        return (Number(number / 100).toLocaleString(undefined, {minimumFractionDigits: 2}) + " " + props.productModel.prices.currency);
    }

    function numberPrice(number) {
        return (Number(number / 100).toLocaleString(undefined, {minimumFractionDigits: 2}));
    }


    function ModelPricesComponentShow(props) {
        const {data} = useForm({
            'wholesale_net_price': props.productModel.prices.wholesale_net_price / 100,
            'wholesale_gross_price': props.productModel.prices.wholesale_gross_price / 100,
            'retail_net_price': props.productModel.prices.retail_net_price / 100,
            'retail_gross_price': props.productModel.prices.retail_gross_price / 100,
            'vat_rate': props.productModel.prices.vat_rate,
        })
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
        const {data, setData, processing} = useForm({
            'wholesale_net_price': props.productModel.prices.wholesale_net_price,
            'wholesale_gross_price': props.productModel.prices.wholesale_gross_price,
            'retail_net_price': props.productModel.prices.retail_net_price,
            'retail_gross_price': props.productModel.prices.retail_gross_price,
            'vat_rate': props.productModel.prices.vat_rate,
        })

        function PriceFiled({price, setPrice}) {
            let newPrice = numberPrice(price)


            const onKeyPress = (event) => {
                const regex = /^[0-9\b]+$/;

                const key = event.key;
                const keyCode = event.keyCode;

                let oldValue = event.target.defaultValue.replace(/,/g, ".") * 100;
                let value = 0;

                // console.log(event)
                if (regex.test(key)) {
                    value = "" + oldValue + key
                    console.log(oldValue, key, value, value < 10000000)
                    if (value < 10000000) setPrice(value)

                } else if (keyCode === 8) {
                    oldValue = String(oldValue)
                    console.log(oldValue.slice(0, -1))
                    value = oldValue.slice(0, -1)
                    setPrice(value)
                }
            }

            return (
                <FormControl sx={{m: 0, width: '25ch'}} variant="outlined">
                    <OutlinedInput
                        id="outlined-adornment-weight"
                        endAdornment={<InputAdornment
                            position="end">{props.productModel.prices.currency}</InputAdornment>}
                        aria-describedby="outlined-weight-helper-text"
                        onKeyDown={onKeyPress}
                        value={newPrice}
                        autoFocus
                    />
                </FormControl>
            );
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
                                <TableCell><PriceFiled price={(data.wholesale_net_price)}
                                                       setPrice={(price) => {
                                                           setData("wholesale_net_price", price)
                                                       }}/></TableCell>
                                <TableCell>{Number(data.wholesale_gross_price).toLocaleString(undefined, {minimumFractionDigits: 2})} {props.productModel.prices.currency}</TableCell>
                                <TableCell>{Number(data.vat_rate).toLocaleString()} %</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Detaliczna</TableCell>
                                <TableCell>{Number(data.retail_net_price).toLocaleString(undefined, {minimumFractionDigits: 2})} {props.productModel.prices.currency}</TableCell>
                                <TableCell>{Number(data.retail_gross_price).toLocaleString(undefined, {minimumFractionDigits: 2})} {props.productModel.prices.currency}</TableCell>
                                <TableCell>{Number(data.vat_rate).toLocaleString()} %</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    }


}

