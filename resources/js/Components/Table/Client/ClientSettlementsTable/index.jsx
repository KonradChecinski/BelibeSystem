import {useMemo} from "react";
import {Box, Tooltip, Typography,} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Done, Close, DownloadDone} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import toLocaleString from "@/Functions/toLocaleString";


export default function ClientSettlementsTable({settlement, readOnly, props}) {
    const theme = useTheme();
    const data = settlement;
    // console.log(data);

    const sumWartoscPierwotna = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.WartoscPierwotna), 0),
        [],
    );
    const sumWartosc = useMemo(
        () => data.reduce((acc, obj) => acc + Number(obj.Wartosc), 0),
        [],
    );

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'nzf_Id',
                header: 'Id',
                size: 10,
            },
            {
                accessorKey: 'Rozliczenie',
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
                enableColumnActions: true,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'nzf_Data',
                header: 'Data',
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY") : "",
                size: 30,
                enableColumnActions: true,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'nzf_NumerPelny',
                header: 'Dokument',
                size: 60,
                enableColumnActions: true,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'nzf_TerminPlatnosci',
                header: 'Termin',
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY") : "",
                size: 30,
                enableColumnActions: true,
                enableColumnDragging: false,
                enableSorting: false,

            },
            {
                accessorKey: 'nzf_DataOstatniejSplaty',
                header: 'Data ostatniej wpłaty',
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>DOW</Box>
                    </Tooltip>
                ),
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY") : "",
                size: 30,
                enableColumnActions: true,
                enableColumnDragging: false,
                enableSorting: false,

            },
            {
                accessorKey: 'DniSpoznienia',
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
                        <Box>S</Box>
                    </Tooltip>
                ),
                enableColumnActions: true,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'WartoscPierwotna',
                header: 'Wartość początkowa W PLN',
                size: 50,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue())),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>WP</Box>
                    </Tooltip>
                ),
                Footer: () => (
                    <Box color="success.main" textAlign={"right"}>{toLocaleString(Number(sumWartoscPierwotna))}</Box>
                ),
                enableColumnActions: true,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'Wartosc',
                header: 'Wartość bieżąca w PLN',
                size: 50,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue())),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>WB</Box>
                    </Tooltip>
                ),
                Footer: () => (
                    <Box color={Number(sumWartosc) == 0 ? "success.main" : "error.main"}
                         textAlign={"right"}>{toLocaleString(Number(sumWartosc))}</Box>
                ),
                enableColumnActions: true,
                enableColumnDragging: false,
                enableSorting: false,
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
            columnVisibility: {nzf_Id: false},
            density: 'compact',
            pagination: {pageSize: 30, pageIndex: 0},
            sorting: [
                {
                    id: 'nzf_Data',
                    desc: true,
                },
            ]
        },
        muiTableContainerProps: {
            sx: {maxHeight: '500px', height: '500px'}
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
