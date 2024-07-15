import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Box, Divider, IconButton, Tooltip, Typography,} from "@mui/material";

import {useTheme} from "@mui/material/styles";
import moment from "moment/moment";
import toLocaleString from "@/Functions/toLocaleString";
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import OrderMenu from "@/Components/Pages/Orders/B2B/Menu/OrderMenu";
import {Info, ReceiptLong} from "@mui/icons-material";

export default function ClientOrderHistoryTable({history, readOnly, props}) {
    const theme = useTheme();
    const data = history;
    // console.log(data);

    const sumWN = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.total_net), 0),
        [],
    );
    const sumWB = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.total_gross), 0),
        [],
    );

    const sumQ = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.total_quantity), 0),
        [],
    );

    const sumWNR = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.discounted_total_net), 0),
        [],
    );
    const sumWBR = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.discounted_total_gross), 0),
        [],
    );

    const sumDN = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.delivery_net), 0),
        [],
    );
    const sumDB = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.delivery_gross), 0),
        [],
    );

    const sumSN = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.delivery_net) + Number(obj.discounted_total_net), 0),
        [],
    );
    const sumSB = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.delivery_gross) + Number(obj.discounted_total_gross), 0),
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
                accessorKey: 'payment_id',
                header: 'Płatność',
                Cell: ({cell}) => cell.getValue() ? props.payment.find(p => p.id === cell.getValue()).name : "",
                size: 10,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'client_location_id',
                header: 'Punkt',
                Cell: ({cell}) => cell.getValue() ? props.client.locations.find(l => l.id === cell.getValue()).note : "",
                size: 10,
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
                Footer: () => (
                    <Box textAlign={"center"}>{Number(sumQ)}</Box>
                ),
                size: 5,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'total_net',
                header: 'Wartość Netto',
                size: 5,
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
                Footer: () => (
                    <Box textAlign={"right"}>{toLocaleString(Number(sumWN) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'total_gross',
                header: 'Wartość Brutto',
                size: 5,
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
                Footer: () => (
                    <Box textAlign={"right"}>{toLocaleString(Number(sumWB) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'discount',
                header: 'Zniżka z płatności',
                size: 5,
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
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'discounted_total_net',
                header: 'Wartość Netto po rabacie',
                size: 5,
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
                Footer: () => (
                    <Box textAlign={"right"}>{toLocaleString(Number(sumWNR) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'discounted_total_gross',
                header: 'Wartość Brutto po rabacie',
                size: 5,
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
                Footer: () => (
                    <Box textAlign={"right"}>{toLocaleString(Number(sumWBR) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },

            {
                accessorKey: 'delivery_net',
                header: 'Dostawa Netto',
                size: 5,
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
                Footer: () => (
                    <Box textAlign={"right"}>{toLocaleString(Number(sumDN) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'delivery_gross',
                header: 'Dostawa Brutto',
                size: 5,
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
                Footer: () => (
                    <Box textAlign={"right"}>{toLocaleString(Number(sumDB) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'summary_net',
                header: 'Suma Netto',
                size: 5,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell, row}) =>
                    (
                        <Box sx={{color: "info.main"}}>
                            {toLocaleString((Number(row.original.delivery_net) + Number(row.original.discounted_total_net)) / 100)}
                        </Box>
                    ),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>SN</Box>
                    </Tooltip>
                ),
                Footer: () => (
                    <Box color="info.main" textAlign={"right"}>{toLocaleString(Number(sumSN) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'summary_gross',
                header: 'Suma Brutto',
                size: 5,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell, row}) =>
                    (
                        <Box sx={{color: "success.main"}}>
                            {toLocaleString((Number(row.original.delivery_gross) + Number(row.original.discounted_total_gross)) / 100)}
                        </Box>
                    ),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>SB</Box>
                    </Tooltip>
                ),
                Footer: () => (
                    <Box color="success.main" textAlign={"right"}>{toLocaleString(Number(sumSB) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },

            // {
            //     accessorKey: 'currency',
            //     header: 'Waluta',
            //     size: 5,
            //     enableColumnActions: false,
            //     enableColumnDragging: false,
            //     enableSorting: false,
            // },

            {
                accessorKey: 'status',
                header: 'Status',
                size: 5,
                Cell: ({cell}) => {
                    let text = "";
                    let color = "";
                    switch (cell.getValue()) {
                        case 1:
                            text = "Złożone";
                            color = "success.main";
                            break;
                        case 2:
                            text = "Zaakceptowane do realizacji";
                            color = "info.main";
                            break;
                        case 3:
                            text = "W trakcie kompletacji";
                            color = "info.main";
                            break;
                        case 4:
                            text = "Przesłane do subiekta";
                            color = "warning.main";
                            break;
                        case 5:
                            text = "Zrealizowane";
                            color = "";
                            break;
                        case 6:
                            text = "Anulowane";
                            color = "error.main";
                            break;
                    }

                    return (
                        <Box sx={{color: color}}>{text}</Box>
                    );

                },
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'subiekt_number',
                header: 'Numer zamówienia w Subiekcie',
                size: 5,
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
                size: 5,
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY HH:mm") : "",
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>DS</Box>
                    </Tooltip>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'created_at',
                header: 'Data złożenia',
                size: 5,
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY HH:mm") : "",
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'invoice',
                header: 'FV',
                size: 10,
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
            // {
            //     accessorKey: 'comment',
            //     header: 'Komentarz',
            //     // Header: ({column}) => (
            //     //     <Tooltip title={column.columnDef.header} placement="top" arrow>
            //     //         <Box>R</Box>
            //     //     </Tooltip>
            //     // ),
            //     size: 5,
            //     enableColumnActions: false,
            //     enableColumnDragging: false,
            //     enableSorting: false,
            // },
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
                        <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                            {row.original.comment && (
                                <Tooltip arrow title={
                                    <>
                                        <Typography variant={"body1"}>
                                            Komentarz:
                                        </Typography>
                                        <Divider sx={{my: 1}}/>

                                        <Typography variant={"body2"}>
                                            {row.original.comment}
                                        </Typography>
                                    </>
                                }>
                                    <IconButton aria-label="showInvoice">
                                        <Info color={"info"}/>
                                    </IconButton>
                                </Tooltip>
                            )}
                            <OrderMenu row={row}/>
                        </Box>
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
