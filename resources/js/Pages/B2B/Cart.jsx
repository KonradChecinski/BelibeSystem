import {Head, Link} from "@inertiajs/react";
import {Fragment} from "react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import {sortBySizesModelColorObject, sortBySizesSortFunction} from "@/Functions/sortBySizes";
import toLocaleString from "@/Functions/toLocaleString";

export default function B2bCart(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    let index = 1;

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

            <Box sx={{width: 1, minHeight: 400, position: "relative"}}>
                <Paper elevation={4}
                       sx={{p: 5, display: "flex", gap: 2, flexDirection: "column"}}>

                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{width: 20}}>Lp.</TableCell>
                                    <TableCell>Rozmiar</TableCell>
                                    <TableCell>Cena Netto</TableCell>
                                    <TableCell>Cena Brutto</TableCell>
                                    <TableCell>Ilość</TableCell>
                                    <TableCell>Suma Netto</TableCell>
                                    <TableCell>Suma Brutto</TableCell>
                                    <TableCell>Label 6</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.cartModels.map((model) => {

                                    return (
                                        <Fragment key={"model" + model.id}>
                                            <TableRow>
                                                <td colSpan={8}>
                                                    <Typography variant="h5" gutterBottom component="h5">
                                                        Model {model.symbol}
                                                    </Typography>
                                                </td>
                                            </TableRow>


                                            {props.cartColors.filter(color => color.product_model_id === model.id).sort(sortByColorShortcut).map((color) => {
                                                return (
                                                    <Fragment key={"color" + color.id}>
                                                        <TableRow>
                                                            <td colSpan={8}>
                                                                <Typography variant="h6" gutterBottom component="h5">
                                                                    Kolor {color.shortcut} - {color.name}
                                                                </Typography>
                                                            </td>
                                                        </TableRow>


                                                        {props.cart.filter(item => item.product_model_color.id === color.id).sort((a, b) => sortBySizesSortFunction(a.product.size.name, b.product.size.name)).map((item, i) => {
                                                            const product = item.product;
                                                            return (
                                                                <Fragment key={"product" + product.id}>
                                                                    <TableRow hover>

                                                                        <TableCell>{index++}</TableCell>
                                                                        <TableCell>{product.size.name}</TableCell>

                                                                        <TableCell>{toLocaleString(item.price_net / 100)}</TableCell>
                                                                        <TableCell>{toLocaleString(item.price_gross / 100)}</TableCell>
                                                                        <TableCell>
                                                                            {item.quantity}
                                                                        </TableCell>
                                                                        <TableCell>{toLocaleString(item.price_net / 100 * item.quantity)}</TableCell>
                                                                        <TableCell>{toLocaleString(item.price_gross / 100 * item.quantity)}</TableCell>
                                                                        <TableCell></TableCell>
                                                                    </TableRow>
                                                                </Fragment>

                                                            );
                                                        })}
                                                    </Fragment>
                                                );
                                            })
                                            }
                                        </Fragment>
                                    );
                                })}

                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>
            </Box>
        </ClientLayout>
    );
}
