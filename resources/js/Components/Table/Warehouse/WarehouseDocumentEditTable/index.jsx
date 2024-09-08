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
import {Link, router, useForm} from "@inertiajs/react";
import {boolean} from "yup";


export default function WarehouseDocumentEditTable({document = [], readOnly, props}) {
    // const data = document.warehouse_document_products

    const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm(document)
    console.log(data)
    console.log(data.warehouse_document_products)

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 10,
            },
            {
                accessorKey: 'product.symbol',
                header: 'Symbol',
                size: 200,

                enableResizing: true,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'product.size.name',
                header: 'Rozmiar',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                size: 70,
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'product.color.shortcut',
                header: 'Kolor',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                size: 60,
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'product.color.name',
                header: 'Nazwa koloru',

                muiTableHeadCellProps: {
                    align: 'center',
                },
                size: 200,
                enableResizing: true,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'price_net',
                header: 'Cena Netto',
                size: 100,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => cell.getValue() && toLocaleString(Number(cell.getValue()) / 100),
                // Header: ({column}) => (
                //     <Tooltip title={column.columnDef.header} placement="top" arrow>
                //         <Box>WN</Box>
                //     </Tooltip>
                // ),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'price_gross',
                header: 'Cena Brutto',
                size: 100,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell}) => cell.getValue() && toLocaleString(Number(cell.getValue()) / 100),
                // Header: ({column}) => (
                //     <Tooltip title={column.columnDef.header} placement="top" arrow>
                //         <Box>WB</Box>
                //     </Tooltip>
                // ),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'quantity',
                header: 'Ilość',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                size: 120,
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'total_net',
                header: 'Wartość Netto',
                size: 120,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({
                           cell,
                           row
                       }) => row.original.price_net && toLocaleString((Number(row.original.price_net) / 100) * row.original.quantity),
                // Header: ({column}) => (
                //     <Tooltip title={column.columnDef.header} placement="top" arrow>
                //         <Box>WN</Box>
                //     </Tooltip>
                // ),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'total_gross',
                header: 'Wartość Brutto',
                size: 120,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({
                           cell,
                           row
                       }) => row.original.price_gross && toLocaleString((Number(row.original.price_gross) / 100) * row.original.quantity),
                // Header: ({column}) => (
                //     <Tooltip title={column.columnDef.header} placement="top" arrow>
                //         <Box>WB</Box>
                //     </Tooltip>
                // ),
                enableResizing: false,
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

                    return (
                        <Box sx={{display: "flex", justifyContent: "flex-end", width: 1}}>
                            {row.original.comment && (
                                <Tooltip
                                    title={row.original.comment}
                                    arrow
                                    placement={"left"}
                                >
                                    <IconButton aria-label="info">
                                        <Info/>
                                    </IconButton>

                                </Tooltip>
                            )}


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
        data: data.warehouse_document_products,
        columns,
        enableTopToolbar: true,
        enableBottomToolbar: true,
        enableGrouping: true,
        enableStickyHeader: true,
        // enableStickyFooter: true,
        localization: MRT_Localization_PL,
        enableColumnResizing: true,
        enableRowNumbers: true,
        initialState: {
            columnVisibility: {
                id: false,

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
                // height: 1
                flex: 1,
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
