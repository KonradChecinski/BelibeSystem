import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Box, Button, Divider, IconButton, Tooltip, Typography,} from "@mui/material";

import {useTheme} from "@mui/material/styles";
import moment from "moment/moment";
import toLocaleString from "@/Functions/toLocaleString";
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {Add, ReceiptLong, Replay, Visibility} from "@mui/icons-material";
import B2bOrderDetails from "@/Components/Pages/B2B/Orders/B2bOrderDetails";
import {enqueueSnackbar} from "notistack";
import AgainOrderDialog from "@/Components/Dialogs/B2bAgainOrderDialog/AgainOrderDialog";

export default function B2bInvoicesTable({invoices, props}) {
    const theme = useTheme();
    const data = invoices;
    // console.log(data);

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'datetime',
                header: 'Data',
                size: 35,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY") : "",
            },
            {
                accessorKey: 'type',
                header: 'Typ',
                size: 5,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                Cell: ({cell}) => {
                    return (
                        <Box>
                            {
                                cell.getValue() === 1 && (
                                    <Box>
                                        Faktura
                                    </Box>
                                )
                            }
                            {
                                cell.getValue() === 2 && (
                                    <Box>
                                        Paragon
                                    </Box>
                                )
                            }
                            {
                                cell.getValue() === 3 && (
                                    <Box>
                                        Korekta
                                    </Box>
                                )
                            }
                        </Box>

                    );

                },

            },
            {
                accessorKey: 'number',
                header: 'Numer',
                size: 35,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
            },
            {
                accessorKey: 'client_order.number',
                header: 'Numer zamówienia',
                size: 35,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
            },

            {
                accessorKey: 'net_value',
                header: 'Wartość Netto',
                size: 5,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
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
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
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
                    const invoice = row.original

                    return (
                        <>
                            <Tooltip title="Pobierz dokument" arrow>
                                {/*<a*/}
                                {/*    href={route("system.invoices.invoice", {invoice: row.original.id})}*/}
                                {/*    target={"_blank"}*/}
                                {/*>*/}
                                <IconButton aria-label="download">
                                    <ReceiptLong color={"success"}/>
                                </IconButton>
                                {/*</a>*/}
                            </Tooltip>

                        </>
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
                    id: 'datetime',
                    desc: true,
                },
            ]
        },
        muiTableContainerProps: {
            sx: {height: 1}
        },
        muiTablePaperProps: ({table}) => ({
            sx: {
                // pl: 1,
                height: 1,
                display: "flex",
                flexDirection: "column",
            },
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
        // muiTableBodyRowProps: ({row}) => {
        //     // console.log(row.original, row.original.Rozliczenie, row.original.Wartosc, row.original.DniSpoznienia)
        //     return ({
        //         sx: {
        //             bgcolor: row.original.Rozliczenie != 2 ? row.original.DniSpoznienia != null ? Number(row.original.Wartosc) > 0 ? "errorBg.main" : "" : "" : ""
        //         },
        //     })
        // },
    });


    return (
        <MaterialReactTable table={table}/>

    );
}
