import {
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import Draggable from "react-draggable";
import moment from "moment";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {ArrowBack, Close, Save} from "@mui/icons-material";

export default function DifferenceDialog({open, setOpen, data, processing, params}) {
    const beforeArray = data?.before
    const afterArray = data?.after
    const onlyInAIds = data?.onlyInAIds
    const intersectionABIds = data?.intersectionABIds
    const onlyInBIds = data?.onlyInBIds

    let tableIndex = 1

    console.log(beforeArray)

    const handleClose = () => {
        setOpen(null);
    };

    const save = () => {
        // post(
        //     route("b2b.order.again", {clientOrder: row.original.id}),
        //     {
        //         preserveScroll: true,
        //         onSuccess: () => {
        //             enqueueSnackbar(`Dodano do koszyka produkty z zamówienia - ${row.original.number}`, {variant: 'success'})
        //             handleClose();
        //
        //         },
        //         onError: errors => {
        //             console.error(errors)
        //             enqueueSnackbar(`Błąd przy dodawaniu do koszyka produktów z zamówienia - ${row.original.number}`, {variant: 'error'})
        //         }
        //     }
        // )

    }


    return (

        <Dialog
            open={Boolean(open)}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            scroll="paper"
            maxWidth={"md"}
            fullWidth
        >

            <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                Różnice przed zapisem i po
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{mb: 2}}>
                    Czy chcesz zapisać poniższe zmiany?
                </DialogContentText>
                <Box>

                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" align={"center"} sx={{textAlign: "center"}}>
                            <TableHead sx={{bgcolor: "secondary"}}>
                                <TableRow>
                                    <TableCell sx={{borderRight: 2, width: 20}} rowSpan={2}>Lp.</TableCell>
                                    <TableCell sx={{borderRight: 2}} align={"center"} colSpan={2}>
                                        Przed zmianami
                                    </TableCell>
                                    <TableCell colSpan={2} align={"center"}>Po zmianach</TableCell>
                                </TableRow>
                                <TableRow sx={{borderBottom: 2}}>
                                    <TableCell align={"center"}>Produkt</TableCell>
                                    <TableCell align={"center"} sx={{borderRight: 2}}>Ilość</TableCell>
                                    <TableCell align={"center"}>Produkt</TableCell>
                                    <TableCell align={"center"}>Ilość</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody
                                sx={{
                                    '& .MuiTableRow-root:nth-of-type(odd)': {
                                        bgcolor: "hoveredCell.background",
                                    },
                                }}
                            >
                                {
                                    intersectionABIds?.map((id, index) => {
                                        const beforeItem = beforeArray.find((item) => item.id === id)
                                        const afterItem = afterArray.find((item) => item.id === id)
                                        return (
                                            <TableRow hover key={"inter" + id}>
                                                <TableCell
                                                    align={"center"}
                                                    sx={{borderRight: 2}}
                                                >
                                                    {tableIndex++}.
                                                </TableCell>

                                                <TableCell align={"center"}>
                                                    {beforeItem.product ? beforeItem.product.symbol : beforeItem.product_symbol}
                                                </TableCell>
                                                <TableCell align={"center"} sx={{borderRight: 2}}>
                                                    {beforeItem.quantity}
                                                </TableCell>


                                                <TableCell align={"center"}>
                                                    {afterItem.product ? afterItem.product.symbol : afterItem.product_symbol}
                                                </TableCell>
                                                <TableCell align={"center"}>
                                                    {afterItem.quantity}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }

                                {
                                    onlyInAIds?.map((id, index) => {
                                        const beforeItem = beforeArray.find((item) => item.id === id)
                                        return (
                                            <TableRow hover key={"inter" + id}>
                                                <TableCell
                                                    align={"center"}
                                                    sx={{borderRight: 2}}
                                                >
                                                    {tableIndex++}.
                                                </TableCell>

                                                <TableCell align={"center"}>
                                                    {beforeItem.product ? beforeItem.product.symbol : beforeItem.product_symbol}
                                                </TableCell>
                                                <TableCell align={"center"} sx={{borderRight: 2}}>
                                                    {beforeItem.quantity}
                                                </TableCell>


                                                <TableCell align={"center"} colSpan={2}>
                                                    <Typography variant="body2" sx={{color: "error.main"}}>
                                                        Usunięte
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }

                                {
                                    onlyInBIds?.map((id, index) => {
                                        // const beforeItem = beforeArray.find((item) => item.id === id)
                                        const afterItem = afterArray.find((item) => item.id === id)
                                        return (
                                            <TableRow hover key={"inter" + id}>
                                                <TableCell
                                                    align={"center"}
                                                    sx={{borderRight: 2}}
                                                >
                                                    {tableIndex++}.
                                                </TableCell>

                                                <TableCell align={"center"} colSpan={2} sx={{borderRight: 2}}>
                                                    <Typography variant="body2" sx={{color: "warning.main"}}>
                                                        Dodane
                                                    </Typography>
                                                </TableCell>

                                                <TableCell align={"center"}>
                                                    {afterItem.product ? afterItem.product.symbol : afterItem.product_symbol}
                                                </TableCell>
                                                <TableCell align={"center"}>
                                                    {afterItem.quantity}
                                                </TableCell>


                                            </TableRow>
                                        )
                                    })
                                }


                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </DialogContent>
            <DialogActions>

                <Button variant="outlined" startIcon={<Close/>} onClick={handleClose}>Anuluj</Button>
                <Button
                    variant="contained"
                    startIcon={<Save/>}
                    onClick={save}
                    disabled={processing}
                    autoFocus
                >
                    Zapisz
                </Button>
            </DialogActions>

        </Dialog>

    );
}


function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}
