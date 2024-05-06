import {DataGrid, GridToolbar, plPL, enUS} from "@mui/x-data-grid";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Box, Button, CircularProgress, ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, Grow,
    IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Popper,
    Tooltip, Typography,
} from "@mui/material";
import {
    Cancel,
    Close, Cloud, ContentCopy, ContentCut, ContentPaste,
    Delete,
    Done,
    DownloadDone,
    Edit,
    ListAlt, MoreVert,
    SettingsBackupRestore,
    TaskAlt,
} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import moment from "moment/moment";
import toLocaleString from "@/Functions/toLocaleString";
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {router} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {ExampleLoaderComponent} from "../../../../../../dev/palette";
import OrderItems from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderItems";
import OrderPayments from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderPayments";
import OrderDeliveries from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderDeliveries";
import OrderLocations from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderLocations";
import OrderSummary from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderSummary";
import OrderComment from "@/Components/Pages/Client/ClientOrderHistoryComponent/OrderComment";

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
                    <Box color="success.main" textAlign={"center"}>{Number(sumQ)}</Box>
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
                    <Box color="success.main" textAlign={"right"}>{toLocaleString(Number(sumWN) / 100)}</Box>
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
                    <Box color="success.main" textAlign={"right"}>{toLocaleString(Number(sumWB) / 100)}</Box>
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
                    <Box color="success.main" textAlign={"right"}>{toLocaleString(Number(sumWNR) / 100)}</Box>
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
                    <Box color="success.main" textAlign={"right"}>{toLocaleString(Number(sumWBR) / 100)}</Box>
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
                    <Box color="success.main" textAlign={"right"}>{toLocaleString(Number(sumDN) / 100)}</Box>
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
                    <Box color="success.main" textAlign={"right"}>{toLocaleString(Number(sumDB) / 100)}</Box>
                ),
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'currency',
                header: 'Waluta',
                size: 5,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'comment',
                header: 'Komentarz',
                // Header: ({column}) => (
                //     <Tooltip title={column.columnDef.header} placement="top" arrow>
                //         <Box>R</Box>
                //     </Tooltip>
                // ),
                size: 5,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
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
                            text = "Przesłane do subiekta";
                            color = "info.main";
                            break;
                        case 4:
                            text = "W trakcie kompletacji";
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
                    const [open, setOpen] = useState(false);
                    const [data, setData] = useState(null)

                    const [anchorEl, setAnchorEl] = useState(null);
                    const openMenu = Boolean(anchorEl);
                    const handleMenuClick = (event) => {
                        setAnchorEl(event.currentTarget);
                    };
                    const handleMenuClose = (event) => {
                        setAnchorEl(null);
                    };


                    const getData = () => {
                        // router.get(route("system.b2b.order", {clientOrder: row.original.id}))
                        axios.get(route("system.b2b.order", {clientOrder: row.original.id}))
                            .then(response => {
                                setData(response.data)
                            })
                            .catch(error => {
                                console.error(error)
                            });
                    }

                    const handleClickOpen = () => {
                        setOpen(true);
                    };

                    const handleClose = () => {
                        setOpen(false);
                    };


                    useEffect(() => {
                        if (open === true && data === null) {
                            getData()
                        }
                    }, [open]);

                    // console.log(row.original)
                    return (
                        <>
                            <Box>
                                <Tooltip title="Szczegóły zamówienia">
                                    <IconButton aria-label="show order" onClick={handleClickOpen}>
                                        <ListAlt/>
                                    </IconButton>
                                </Tooltip>


                                <IconButton
                                    aria-label="more"
                                    onClick={handleMenuClick}
                                >
                                    <MoreVert/>
                                </IconButton>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleMenuClose}
                                >

                                    <MenuItem disabled={![1].includes(row.original.status)}
                                              onClick={handleClickOpen}>
                                        <ListItemIcon><TaskAlt/></ListItemIcon>
                                        <ListItemText>Zaakceptuj zamówienie</ListItemText>
                                    </MenuItem>
                                    <MenuItem disabled={![3, 4].includes(row.original.status)}
                                              onClick={handleClickOpen}>
                                        <ListItemIcon><SettingsBackupRestore/></ListItemIcon>
                                        <ListItemText>Ponów dodawanie do subiekta</ListItemText>
                                    </MenuItem>

                                    <MenuItem disabled={![1, 2, 3].includes(row.original.status)}
                                              onClick={handleClickOpen}>
                                        <ListItemIcon><Cancel/></ListItemIcon>
                                        <ListItemText>Anuluj zamówienie</ListItemText>
                                    </MenuItem>

                                    <MenuItem disabled={![1].includes(row.original.status)}
                                              onClick={handleClickOpen}>
                                        <ListItemIcon><Edit/></ListItemIcon>
                                        <ListItemText>Edytuj</ListItemText>
                                    </MenuItem>

                                    <Divider/>
                                </Menu>
                            </Box>

                            <Dialog
                                fullWidth={true}
                                maxWidth={"xl"}
                                open={open}
                                onClose={handleClose}
                            >
                                <DialogTitle>Szczegóły zamówienia - {row?.original?.number}</DialogTitle>
                                <DialogContent>
                                    {data ?
                                        (
                                            <>
                                                <OrderItems data={data}/>
                                                <Box sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    flexWrap: "wrap",
                                                    justifyContent: "space-between",
                                                    gap: 2,
                                                    my: 2,
                                                }}>
                                                    <OrderPayments data={data}/>
                                                    <OrderDeliveries data={data}/>
                                                    <OrderLocations data={data}/>
                                                </Box>
                                                <OrderComment data={data}/>
                                                <OrderSummary data={data}/>

                                            </>
                                        )
                                        :
                                        (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    m: 'auto',
                                                    width: 'fit-content',
                                                }}
                                            >
                                                <CircularProgress/>
                                            </Box>


                                        )}

                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>Zamknij</Button>
                                </DialogActions>
                            </Dialog>

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
