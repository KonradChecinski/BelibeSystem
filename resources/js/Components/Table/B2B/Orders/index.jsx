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

export default function B2bOrdersTable({orders, props}) {
    const theme = useTheme();
    const data = orders;
    // console.log(data);

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'created_at',
                header: 'Data',
                size: 35,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY HH:mm") : "",
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
                accessorKey: 'status',
                header: 'Status',
                size: 5,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                Cell: ({cell}) => {
                    let statusText = "";
                    let statusColor = "";
                    switch (cell.getValue()) {
                        case 1:
                            statusText = "Złożone";
                            statusColor = "success.main";
                            break;
                        case 2:
                            statusText = "Zaakceptowane do realizacji";
                            statusColor = "info.main";
                            break;
                        case 3:
                            statusText = "W realizacji";
                            statusColor = "info.main";
                            break;
                        case 4:
                            statusText = "W realizacji";
                            statusColor = "info.main";
                            break;
                        case 5:
                            statusText = "Zrealizowane";
                            statusColor = "";
                            break;
                        case 6:
                            statusText = "Anulowane";
                            statusColor = "error.main";
                            break;
                    }

                    return (
                        <Box sx={{color: statusColor}}>{statusText}</Box>
                    );

                },

            },
            {
                accessorKey: 'total_quantity',
                header: 'Ilość produktów',
                size: 10,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: true,
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'location',
                header: 'Miejsce dostawy',
                size: 10,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                Cell: ({cell}) => {
                    const location = cell.getValue()
                    return (
                        <Box>
                            <Typography variant="body2" gutterBottom>
                                {location.note}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {location.street} {location.building_number}{location.apartment_number ? "/" + location.apartment_number : ""}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {location.postal_code}, {location.city}
                            </Typography>
                        </Box>
                    )
                }
            },
            {
                accessorKey: 'delivery',
                header: 'Dostawa',
                size: 10,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                Cell: ({cell, row}) => {
                    const delivery = cell.getValue()
                    const delivery_net = row.original.delivery_net
                    const delivery_gross = row.original.delivery_gross

                    return (
                        <Box sx={{display: "flex", gap: 2}}>
                            <Box>
                                <Typography variant="body2">
                                    {delivery.name}
                                </Typography>
                                <Typography variant="body2">
                                    {delivery.description}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2">
                                    {toLocaleString(delivery_net / 100)} netto
                                </Typography>
                                <Typography variant="body2">
                                    {toLocaleString(delivery_gross / 100)} brutto
                                </Typography>
                            </Box>


                        </Box>
                    )

                }
            },
            {
                accessorKey: 'payment',
                header: 'Płatność',
                size: 10,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                Cell: ({cell, row}) => {
                    const payment = cell.getValue()
                    const discount = row.original.discount

                    return (
                        <Box>

                            <Typography variant="body2">
                                {payment.name}
                            </Typography>
                            <Typography variant="body2">
                                {discount}% rabatu
                            </Typography>


                        </Box>
                    )

                }
            },


            {
                accessorKey: 'discounted_total_net',
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
                accessorKey: 'discounted_total_gross',
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
            //

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
                    const order = row.original

                    const [openDetails, setOpenDetails] = useState(false);
                    const [openAgainDialog, setOpenAgainDialog] = useState(false);
                    const handleOpenDetails = () => {
                        setOpenDetails(true);
                    };
                    const handleCloseDetails = () => {
                        setOpenDetails(false);
                    };

                    const handleAgainOrder = () => {
                        setOpenAgainDialog(true);
                    };

                    return (
                        <>
                            <Tooltip title="Pokaż zamówienie" arrow>
                                <IconButton aria-label="visibility" onClick={handleOpenDetails}>
                                    <Visibility/>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Ponów zamówienie" arrow>
                                <IconButton aria-label="repeat" onClick={handleAgainOrder}>
                                    <Replay/>
                                </IconButton>
                            </Tooltip>

                            <B2bOrderDetails open={openDetails} handleClose={handleCloseDetails} row={row}/>
                            <AgainOrderDialog open={openAgainDialog} setOpen={setOpenAgainDialog} row={row}
                                              params={props}/>
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
                    id: 'created_at',
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
