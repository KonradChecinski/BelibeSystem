import {useMemo, useState} from "react";
import {Box, Button, Fab, IconButton, Tooltip, Typography,} from "@mui/material";
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
    Sell, ShoppingCart, Info
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
import OrderMenu from "@/Components/Pages/Orders/Other/Menu/OrderMenu";


export default function OrderListOtherTable({orders = [], readOnly, props}) {
    const theme = useTheme();
    const data = orders
    console.log(data)

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
                Cell: ({cell, row}) => {
                    // console.log(row.original)
                    return (
                        <Box>
                            {cell.getValue() === 1 && (
                                <Tooltip title="Shoper">
                                    <ShoppingCart color={"success"}/>
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
                size: 10,
                Cell: ({cell, row}) => {
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
                accessorKey: 'ordered_at',
                header: 'Data',
                // columnDefType: 'display',
                width: 20,
                Cell: ({cell, row}) => moment(cell.getValue()).format("DD-MM-YYYY HH:mm:ss"),
                enableColumnActions: false,
                enableColumnDragging: true,
                enableSorting: true,
            },
            {
                accessorKey: 'number',
                header: 'Numer',
                width: 10,
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
                size: 5,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'total_gross',
                header: 'Wartość Brutto',
                // size: 2,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue())),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>WB</Box>
                    </Tooltip>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            // {
            //     accessorKey: 'discount',
            //     header: 'Zniżka z płatności',
            //     size: 5,
            //     muiTableBodyCellProps: {
            //         align: 'center',
            //     },
            //     muiTableHeadCellProps: {
            //         align: 'center',
            //     },
            //     Cell: ({cell}) => Number(cell.getValue()) + "%",
            //     Header: ({column}) => (
            //         <Tooltip title={column.columnDef.header} placement="top" arrow>
            //             <Box>Z</Box>
            //         </Tooltip>
            //     ),
            //     enableColumnActions: false,
            //     enableColumnDragging: false,
            //     enableSorting: false,
            // },
            {
                accessorKey: 'delivery_name',
                header: 'Dostawa',
                width: 5,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                // Cell: ({cell}) => toLocaleString(Number(cell.getValue())),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>Dostawa</Box>
                    </Tooltip>
                ),
                enableColumnActions: false,
                enableColumnDragging: true,
                enableSorting: true,
            },
            {
                accessorKey: 'delivery_gross',
                header: 'Dostawa Brutto',
                width: 5,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => toLocaleString(Number(cell.getValue())),
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>DB</Box>
                    </Tooltip>
                ),
                enableColumnActions: false,
                enableColumnDragging: true,
                enableSorting: true,
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
                        <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                            {row.original.comment && (
                                <Tooltip title={row.original.comment} arrow placement={"left"}>

                                    <IconButton aria-label="info">
                                        <Info/>
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
        // enableStickyFooter: true,
        localization: MRT_Localization_PL,
        initialState: {
            columnVisibility: {id: false},
            density: 'compact',
            pagination: {pageSize: 50, pageIndex: 0},
            sorting: [
                {
                    id: 'ordered_at',
                    desc: true,
                },
            ]
        },
        muiTableContainerProps: {
            sx: {height: "calc(100% - 110px)"},
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
