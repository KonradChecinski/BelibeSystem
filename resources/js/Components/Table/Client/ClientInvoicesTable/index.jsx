import {useMemo} from "react";
import {useTheme} from "@mui/material/styles";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import toLocaleString from "@/Functions/toLocaleString";
import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import moment from "moment";
import {Autorenew, ReceiptLong} from "@mui/icons-material";
import {router} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function ClientInvoicesTable({invoices, readOnly, props}) {
    const theme = useTheme();
    const data = invoices;
    console.log(data);

    const sumWN = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.net_value), 0),
        [],
    );
    const sumWB = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.gross_value), 0),
        [],
    );


    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 10,

            },
            {
                accessorKey: 'number',
                header: 'Numer',
                size: 35,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'datetime',
                header: 'Data',
                size: 35,
                Cell: ({cell}) => moment(cell.getValue()).format("DD-MM-YYYY"),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'client_order.number',
                header: 'Numer zamówienia',
                size: 35,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'net_value',
                header: 'Wartość Netto',
                size: 5,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>WN</Box>
                    </Tooltip>
                ),
                Footer: () => (
                    <Box textAlign={"right"}>{toLocaleString(Number(sumWN) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'gross_value',
                header: 'Wartość Brutto',
                size: 5,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => <Box color="success.main"
                                       textAlign={"right"}>{toLocaleString(Number(cell.getValue()) /
                    100)}</Box>,
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>WB</Box>
                    </Tooltip>
                ),
                Footer: () => (
                    <Box color="warning.main" textAlign={"right"}>{toLocaleString(Number(sumWB) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 35,
                Cell: ({cell, row}) => {

                    return (
                        <Box>
                            {cell.getValue() === 0 && "Nie pobrana"}
                            {cell.getValue() === 1 && "Pobrana"}
                            {cell.getValue() === 2 && "Zaakceptowana"}
                        </Box>
                    )
                },
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'downloaded_at',
                header: 'Data pobrania',
                size: 35,
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY HH:mm:ss") : "Nie pobrano",
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
                    const handleGetInvoice = () => {
                        router.post(
                            route("system.orders.order.b2b.create.invoice", {clientOrder: row.original.id}),
                            {
                                // status: 2
                            },
                            {
                                preserveScroll: true,
                                onSuccess: () => {
                                    enqueueSnackbar("Zlecono wygenerowanie faktury", {variant: 'success'})
                                },
                                onError: errors => {
                                    console.error(errors)
                                    enqueueSnackbar("Błąd przy zlecaniu wygenerowania faktury", {variant: 'error'})
                                }
                            }
                        )
                    };

                    return (
                        <Box>
                            <Tooltip arrow title={"Podgląd faktury"}>
                                <a
                                    href={route("system.invoices.invoice", {invoice: row.original.id})}
                                    target={"_blank"}
                                >
                                    <IconButton aria-label="showInvoice">
                                        <ReceiptLong color={"info"}/>
                                    </IconButton>
                                </a>
                            </Tooltip>
                            <Tooltip title={"Wygeneruyj fakturę ponownie"} arrow>
                                <IconButton aria-label="showInvoice" onClick={handleGetInvoice}>
                                    <Autorenew color={"secondary"}/>
                                </IconButton>
                            </Tooltip>

                        </Box>
                        // <OrderMenu row={row}/>
                    )

                },
                size: 10,
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
        enableStickyFooter: true,
        localization: MRT_Localization_PL,
        initialState: {
            columnVisibility: {id: false, subiekt_added_at: false},
            density: 'compact',
            pagination: {pageSize: 30, pageIndex: 0},
            sorting: [
                {
                    id: 'id',
                    desc: true,
                },
            ]
        },
        muiTableContainerProps: {
            sx: {maxHeight: '400px'}
        },
        muiTablePaperProps: ({table}) => ({
            sx: {
                pl: 1
            },
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
        muiTableBodyRowProps: ({row}) => {
            // console.log(row.original, row.original.Rozliczenie, row.original.Wartosc, row.original.DniSpoznienia)
            return ({
                sx: {
                    bgcolor: row.original.Rozliczenie != 2 ? row.original.DniSpoznienia != null ? Number(row.original.Wartosc) > 0 ? "errorBg.main" : "" : "" : ""
                },
            })
        },
    });


    return (
        <MaterialReactTable table={table}/>

    );
}
