import {useMemo, useState} from "react";
import {
    Box,
    Button, Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {
    Done,
    Close,
    DownloadDone,
    BorderAll,
    Code,
    Add,
    Delete,
    Edit,
    ContentCopy,
    Upgrade,
    Sell, ShoppingCart, Info, ReceiptLong, Print, PersonSearch
} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import 'cronstrue/locales/pl';
import {enqueueSnackbar} from "notistack";
import toLocaleString from "@/Functions/toLocaleString";
import OrderMenu from "@/Components/Pages/Orders/B2B/Menu/OrderMenu";
import {Link, router} from "@inertiajs/react";
import {boolean} from "yup";


export default function WarehouseDocumentListTable({documents = [], readOnly, props}) {
    const data = documents
    // console.log(data)

    const reloadData = () => {
        setTimeout(() => {
            router.reload({only: ['warehouseDocuments']})
        }, 1000)
    }

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 10,
            },
            {
                accessorKey: 'type',
                header: 'Typ',
                size: 10,
                columnDefType: 'display',
                Cell: ({cell, row}) => {
                    // console.log(row.original)
                    return (
                        <Box>
                            {cell.getValue() === 1 && (
                                <Tooltip title="B2B">
                                    <Sell color={"info"}/>
                                </Tooltip>
                            )}
                        </Box>
                    )

                },
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 140,
                Cell: ({cell, row}) => {
                    let text = "";
                    let color = "";
                    switch (cell.getValue()) {
                        case 10:
                            text = "Złożone";
                            color = "success.main";
                            break;
                        case 50:
                            text = "Kompletowane";
                            color = "info.main";
                            break;
                        case 100:
                            text = "Zrealizowane";
                            color = "";
                            break;
                        case 0:
                            text = "Anulowane";
                            color = "error.main";
                            break;
                    }

                    return (
                        <Box sx={{color: color}}>{text}</Box>
                    );

                },
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'created_at',
                header: 'Data',
                // columnDefType: 'display',
                size: 140,
                enableResizing: false,
                Cell: ({cell, row}) => moment(cell.getValue()).format("DD-MM-YYYY HH:mm:ss"),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
            },
            {
                accessorKey: 'number',
                header: 'Numer',
                muiTableBodyCellProps: {
                    align: 'left',
                },
                muiTableHeadCellProps: {
                    align: 'left',
                },
                size: 100,
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'client_order.client.name',
                header: 'Klient',
                size: 400,

                enableResizing: true,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'total_quantity',
                header: 'Ilość produktów',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>IP</Box>
                    </Tooltip>
                ),
                size: 40,
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'total_net',
                header: 'Wartość Netto',
                size: 80,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>WN</Box>
                    </Tooltip>
                ),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'total_gross',
                header: 'Wartość Brutto',
                size: 80,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>WB</Box>
                    </Tooltip>
                ),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'discount',
                header: 'Zniżka z płatności',
                size: 20,
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => Number(cell.getValue()) + "%",
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>Z</Box>
                    </Tooltip>
                ),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'discounted_total_net',
                header: 'Wartość Netto po rabacie',
                size: 80,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>WN (R)</Box>
                    </Tooltip>
                ),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
            },
            {
                accessorKey: 'discounted_total_gross',
                header: 'Wartość Brutto po rabacie',
                size: 80,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>WB (R)</Box>
                    </Tooltip>
                ),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
            },
            {
                accessorKey: 'currency',
                header: 'Waluta',
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'action',
                header: 'Akcje',
                columnDefType: 'display',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell, row}) => {
                    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
                    const handleAccept = (e) => {
                        setShowAcceptDialog(!showAcceptDialog)
                    }

                    const acceptDocument = (createInvoice) => {
                        router.post(
                            route("system.warehouse.document.accept", {warehouseDocument: row.original.id}),
                            {
                                create_invoice: createInvoice
                            },
                            {
                                preserveScroll: true,
                                onSuccess: () => {
                                    enqueueSnackbar("Dokument został zatwierdzony", {variant: "success"});
                                    reloadData();
                                },
                                onError: (error) => {
                                    enqueueSnackbar("Błąd zatwierdzania dokumentu", {variant: "error"});
                                    console.log(error)
                                }
                            }
                        )
                    }

                    return (
                        <Box sx={{display: "flex", justifyContent: "flex-end", width: 1}}>
                            {row.original.client_comment && (
                                <Tooltip
                                    title={
                                        <>
                                            <Typography variant={"body1"} sx={{color: "warning.main"}}>
                                                Uwagi klienta:
                                            </Typography>
                                            <Typography variant={"body2"}>
                                                {row.original.client_comment}
                                            </Typography>
                                        </>
                                    }
                                    arrow
                                    placement={"left"}
                                >

                                    <IconButton aria-label="info">
                                        <Info/>
                                    </IconButton>

                                </Tooltip>
                            )}
                            {row.original.user_comment && (
                                <Tooltip
                                    title={
                                        <>
                                            <Typography variant={"body1"} sx={{color: "warning.main"}}>
                                                Uwagi systemowe:
                                            </Typography>
                                            <Typography variant={"body2"}>
                                                {row.original.user_comment}
                                            </Typography>
                                        </>
                                    }
                                    arrow
                                    placement={"left"}
                                >

                                    <IconButton aria-label="info">
                                        <PersonSearch/>
                                    </IconButton>

                                </Tooltip>
                            )}

                            <Tooltip title={"Edytuj"} arrow placement={"bottom"}>
                                <Link
                                    href={route("system.warehouse.document.edit", {warehouseDocument: row.original.id})}
                                >
                                    <IconButton aria-label="edit" disabled={row.original.status === 100}>
                                        <Edit/>
                                    </IconButton>
                                </Link>
                            </Tooltip>

                            <Tooltip title={"Drukuj"} arrow placement={"bottom"}>
                                <a
                                    href={route("system.warehouse.document.print", {warehouseDocument: row.original.id})}
                                    target="_blank"
                                >
                                    <IconButton aria-label="print" onClick={reloadData}>
                                        <Print/>
                                    </IconButton>
                                </a>
                            </Tooltip>

                            <Tooltip title={"Zaakceptuj"} arrow placement={"bottom"}>
                                <IconButton
                                    aria-label="accept"
                                    disabled={row.original.status !== 50}
                                    onClick={handleAccept}
                                >
                                    <Done/>
                                </IconButton>
                            </Tooltip>
                            <Dialog
                                open={showAcceptDialog}
                                onClose={handleAccept}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Potwierdzenie DM
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Czy chcesz zatwierdzić dokument magazynowy {row.original.number}?
                                    </DialogContentText>
                                    <DialogContentText id="alert-dialog-description">
                                        Zamówienie zostanie przekazane do subiekta.
                                    </DialogContentText>
                                    <DialogContentText id="alert-dialog-description">
                                        Możesz utworzyć automatycznie do zamówienia fakturę
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant={"outlined"} onClick={handleAccept}>Nie</Button>
                                    <Button variant={"contained"} onClick={() => acceptDocument(false)}>Tak, bez
                                        faktury</Button>
                                    <Button variant={"contained"} color={"info"} autoFocus
                                            onClick={() => acceptDocument(true)}>Tak, z
                                        fakturą</Button>
                                </DialogActions>
                            </Dialog>


                        </Box>
                    )
                },
                size: 190,
            },
        ],
        [],
        //end
    );

    const table = useMaterialReactTable({
        data,
        columns,
        enableTopToolbar: true,
        enableBottomToolbar: true,
        enableGrouping: true,
        enableStickyHeader: true,
        // enableStickyFooter: true,
        localization: MRT_Localization_PL,
        enableColumnResizing: true,
        initialState: {
            columnVisibility: {
                id: false,
                total_gross: false,
                total_net: false,
                currency: false,
                subiekt_number: false,
                subiekt_added_at: false,

            },
            density: 'compact',
            pagination: {pageSize: 50, pageIndex: 0},
            sorting: [
                {
                    id: 'created_at',
                    desc: true,
                },
            ]
        },
        muiTableContainerProps: {
            sx: {
                height: "calc(100% - 110px)",
            },
        },
        // muiTableProps: {
        //     sx: {height: 1}
        // },
        muiTablePaperProps: ({table}) => ({
            sx: {
                pl: 1,
                height: 1
            },
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
    });


    return (
        <>
            <MaterialReactTable table={table}/>
        </>

    );
}
