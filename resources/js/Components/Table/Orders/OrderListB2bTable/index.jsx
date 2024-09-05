import {useMemo, useState} from "react";
import {Box, Button, Divider, Fab, IconButton, Tooltip, Typography,} from "@mui/material";
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
    Sell, ShoppingCart, Info, ReceiptLong, PersonSearch
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
import {Link} from "@inertiajs/react";


export default function OrderListB2bTable({orders = [], readOnly, props}) {
    const theme = useTheme();
    const data = orders
    // console.log(data)

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
                            {cell.getValue() === 0 && (
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
                accessorKey: 'invoice',
                header: 'FV',
                size: 5,
                columnDefType: 'display',
                Cell: ({cell, row}) => {
                    // console.log(row.original)
                    return (
                        <Box>
                            {cell.getValue() && (
                                <Tooltip arrow title={
                                    <>
                                        <Typography variant={"body1"}>
                                            Faktura: {cell.getValue().number}
                                        </Typography>
                                        <Typography variant={"body2"}>
                                            Wygenerowana: {moment(cell.getValue().created_at).format("DD-MM-YYYY HH:mm:ss")}
                                        </Typography>
                                        <Divider sx={{my: 1}}/>

                                        <Typography variant={"body2"} color={"warning.main"}>
                                            Wartość Netto: {toLocaleString(Number(cell.getValue().net_value) / 100)}
                                        </Typography>
                                        <Typography variant={"body1"} color={"warning.main"}>
                                            Wartość Brutto: {toLocaleString(Number(cell.getValue().gross_value) / 100)}
                                        </Typography>

                                        <Divider sx={{my: 1}}/>

                                        <Typography variant={"body2"}>
                                            Kliknij w przycisk by otworzyć podgląd faktury
                                        </Typography>
                                    </>
                                }>
                                    <a
                                        href={route("system.invoices.invoice", {invoice: cell.getValue().id})}
                                        target={"_blank"}
                                    >
                                        <IconButton aria-label="showInvoice">
                                            <ReceiptLong color={"success"}/>
                                        </IconButton>
                                    </a>
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
                        case 1:
                            text = "Złożone";
                            color = "success.main";
                            break;
                        case 20:
                            text = "Zaakceptowane";
                            color = "info.main";
                            break;
                        case 50:
                            text = "W magazynie";
                            color = "info.main";
                            break;
                        case 55:
                            text = "Kompletowane";
                            color = "info.main";
                            break;
                        case 60:
                            text = "Skompletowane";
                            color = "info.main";
                            break;
                        case 90:
                            text = "W subiekcie";
                            color = "warning.main";
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
                accessorKey: 'client.name',
                header: 'Klient',
                size: 450,

                enableResizing: true,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
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
                accessorKey: 'delivery_net',
                header: 'Dostawa Netto',
                size: 60,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>DN</Box>
                    </Tooltip>
                ),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
            },
            {
                accessorKey: 'delivery_gross',
                header: 'Dostawa Brutto',
                size: 60,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>DB</Box>
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
                accessorKey: 'subiekt_number',
                header: 'Numer zamówienia w Subiekcie',
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>NS</Box>
                    </Tooltip>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'subiekt_added_at',
                header: 'Data dodania do Subiekta',
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY HH:mm") : "",
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>DS</Box>
                    </Tooltip>
                ),
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
                            <OrderMenu row={row}/>
                        </Box>
                    )
                },
                size: 120,
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
