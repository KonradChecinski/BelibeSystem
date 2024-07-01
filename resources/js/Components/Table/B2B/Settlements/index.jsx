import {useMemo} from "react";
import {Box, IconButton, Tooltip} from "@mui/material";

import {useTheme} from "@mui/material/styles";
import moment from "moment/moment";
import toLocaleString from "@/Functions/toLocaleString";
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {Close, Done, DownloadDone, ReceiptLong} from "@mui/icons-material";

export default function B2bSettlementsTable({settlements, props}) {
    const theme = useTheme();
    const data = settlements;
    // console.log(data);

    const sumWartosc = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.value / 100), 0),
        [],
    );

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'settlement',
                header: 'Rozliczenie',
                Cell: ({cell}) => {
                    return (
                        <>
                            {cell.getValue() == 2 ?
                                <Tooltip title={"Całkowita spłata"} color={"success"} placement="top" arrow>
                                    <Done/>
                                </Tooltip>
                                : null}
                            {cell.getValue() == 1 ?
                                <Tooltip title={"Częściowa spłata"} color={"warning"} placement="top" arrow>
                                    <DownloadDone/>
                                </Tooltip>
                                : null}
                            {cell.getValue() == 0 ?
                                <Tooltip title={"Brak spłaty"} color={"error"} placement="top" arrow>
                                    <Close/>
                                </Tooltip>
                                : null}
                        </>
                    );

                },
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>R</Box>
                    </Tooltip>
                ),
                size: 5,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'datetime',
                header: 'Data',
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY") : "",
                size: 30,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
            },
            {
                accessorKey: 'number',
                header: 'Dokument',
                size: 60,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'date_of_payment',
                header: 'Termin',
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY") : "",
                size: 30,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,

            },
            {
                accessorKey: 'date_of_last_payment',
                header: 'Data ostatniej wpłaty',
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>DOW</Box>
                    </Tooltip>
                ),
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY") : "",
                size: 30,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,

            },
            {
                accessorKey: 'days_of_delay',
                header: 'Spóźnienie',
                size: 30,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => cell.getValue() ?
                    <Box sx={{color: "error.main"}}>{Number(cell.getValue())}</Box> : "",
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>Spóźnienie</Box>
                    </Tooltip>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },

            {
                accessorKey: 'original_value',
                header: 'Wartość początkowa',
                size: 50,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>Wartość początkowa</Box>
                    </Tooltip>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
            },
            {
                accessorKey: 'value',
                header: 'Wartość bieżąca',
                size: 50,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue()) / 100),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>Wartość bieżąca</Box>
                    </Tooltip>
                ),
                Footer: () => (
                    <Box color={Number(sumWartosc) === 0 ? "success.main" : "error.main"}
                         textAlign={"right"}>{toLocaleString(Number(sumWartosc))}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
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
        muiTableBodyRowProps: ({row}) => {
            // console.log(row.original, row.original.Rozliczenie, row.original.Wartosc, row.original.DniSpoznienia)
            return ({
                sx: {
                    bgcolor: row.original.settlement != 2 ? row.original.days_of_delay != null ? Number(row.original.value) > 0 ? "errorBg.main" : "" : "" : ""
                },
            })
        },
    });


    return (
        <MaterialReactTable table={table}/>

    );
}
