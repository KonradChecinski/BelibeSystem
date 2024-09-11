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

export default function DifferenceDialog({open, setOpen, data, processing, params}) {

    const handleClose = () => {
        setOpen(false);
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
            open={open}
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
                <DialogContentText>

                </DialogContentText>
                <Box>

                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" align={"center"} sx={{textAlign: "center"}}>
                            <TableHead sx={{bgcolor: "secondary"}}>
                                <TableRow>
                                    <TableCell sx={{borderRight: 2}} rowSpan={2}>Lp.</TableCell>
                                    <TableCell sx={{borderRight: 2}} align={"center"} colSpan={2}>
                                        Przed zmianami
                                    </TableCell>
                                    <TableCell colSpan={2} align={"center"}>Po zmianach</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align={"center"}>Produkt</TableCell>
                                    <TableCell align={"center"} sx={{borderRight: 2}}>Ilość</TableCell>
                                    <TableCell align={"center"}>Produkt</TableCell>
                                    <TableCell align={"center"}>Ilość</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody
                                sx={{
                                    '& .MuiTableRow:nth-of-type(odd)': {
                                        bgcolor: "hoveredCell.background",
                                    },
                                }}
                            >
                                <TableRow hover>
                                    <TableCell sx={{borderRight: 2}}>1.</TableCell>
                                    <TableCell>value 2</TableCell>
                                    <TableCell sx={{borderRight: 2}}>value 1</TableCell>
                                    <TableCell>value 2</TableCell>
                                    <TableCell>value 2</TableCell>
                                </TableRow>

                                <TableRow hover>
                                    <TableCell>1.</TableCell>
                                    <TableCell>value 2</TableCell>
                                    <TableCell sx={{borderRight: 2}}>value 1</TableCell>
                                    <TableCell>value 2</TableCell>
                                    <TableCell>value 2</TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell>1.</TableCell>
                                    <TableCell>value 2</TableCell>
                                    <TableCell sx={{borderRight: 2}}>value 1</TableCell>
                                    <TableCell>value 2</TableCell>
                                    <TableCell>value 2</TableCell>
                                </TableRow>
                                <TableRow hover>
                                    <TableCell>1.</TableCell>
                                    <TableCell>value 2</TableCell>
                                    <TableCell sx={{borderRight: 2}}>value 1</TableCell>
                                    <TableCell>value 2</TableCell>
                                    <TableCell>value 2</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Zamknij
                </Button>


                <Button onClick={save} disabled={processing} autoFocus>
                    Tak
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
