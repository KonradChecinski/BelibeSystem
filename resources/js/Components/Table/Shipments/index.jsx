import {useMemo, useState} from "react";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import DeliveryAddDialog from "@/Components/Dialogs/DeliveriesDialog/DeliveryAddDialog";
import {Box, Fab, IconButton, Tooltip, Typography, Link as MLink, Button} from "@mui/material";
import {Add, Info, PersonSearch} from "@mui/icons-material";
import ShipmentMenu from "@/Components/Pages/Shipments/Menu/ShipmentMenu";
import moment from "moment/moment";
import {Link, usePage} from "@inertiajs/react";

export default function ShipmentsTable(props) {
    // console.log(props)
    const data = props.shipments;
    const pageAuth = usePage()?.props?.auth;
    const auth = props.auth || pageAuth;

    const [openDialogAdd, setOpenDialogAdd] = useState(false);

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 20,
            },
            {
                accessorKey: 'orderable_type',
                header: 'Typ',
                size: 140,
                Cell: ({cell, row}) => {
                    return (
                        <Box>
                            {cell.getValue() && cell.getValue() === "App\\Models\\ClientOrder" && (
                                <Tooltip arrow title={
                                    <>
                                        <Typography variant={"body2"}>
                                            Przejdź do klienta
                                        </Typography>
                                    </>
                                }>
                                    <Link
                                        href={route("system.clients.client.edit", {id: row.original.orderable.client_id})}
                                    >
                                        B2B ({row.original.orderable.number})
                                    </Link>
                                </Tooltip>
                            )}
                            {cell.getValue() && cell.getValue() === "App\\Models\\Order" && (
                                <Tooltip arrow title={
                                    <>
                                        <Typography variant={"body2"}>
                                            Przejdź do Zamówień
                                        </Typography>
                                    </>
                                }>
                                    <Link
                                        href={route("system.orders.other")}
                                    >
                                        Inne
                                    </Link>
                                </Tooltip>
                            )}
                        </Box>
                    )

                },
            },
            {
                accessorKey: 'courier.name',
                header: 'Kurier',
                size: 60,
            },
            {
                accessorKey: 'address',
                header: 'Adres',
                size: 260,
                // columnDefType: 'display',
                Cell: ({cell, row}) => {
                    return (
                        <Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                my: 1,
                            }}>
                                <Typography variant="caption">
                                    {row.original.recipient_company}
                                </Typography>
                                <Typography variant="caption">
                                    {row.original.recipient_name}
                                </Typography>
                                <Typography variant="caption">
                                    {row.original.recipient_street || ''} {row.original.recipient_building_number || ''}
                                    {row.original.recipient_apartment_number ? `/${row.original.recipient_apartment_number}` : ''}
                                </Typography>
                                <Typography variant="caption">
                                    {row.original.recipient_postal_code || ''} {row.original.recipient_city || ''}
                                </Typography>
                            </Box>

                        </Box>
                    )

                },
            },
            {
                accessorKey: 'recipient_email',
                header: 'Email',
                size: 150,
            },
            {
                accessorKey: 'recipient_phone',
                header: 'Numer telefonu',
                size: 100,
            },
            {
                accessorKey: 'package_count',
                header: 'Ilość paczek',
                size: 100,
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>IP</Box>
                    </Tooltip>
                ),
            },
            {
                accessorKey: 'packages',
                header: 'Paczki',
                size: 300,
                Cell: ({cell, row}) => {
                    return (
                        <Box sx={{display: "flex", justifyContent: "flex-end", flexDirection: 'column', width: 1}}>

                            {cell.getValue().map((p, index) => (
                                <Box
                                    key={p.external_number}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mr: 1,
                                        borderBottom: 1,
                                        borderColor: "divider",
                                        py: 1,
                                        width: 1,
                                        justifyContent: "flex-start",
                                        gap: 1,
                                    }}>
                                    <Box>{index + 1}: {parseFloat(p.weight).toFixed(2) || '-'} kg</Box>
                                    <Box>{p.width || '-'} x {p.height || '-'} x {p.depth || '-'} cm</Box>
                                    <Box>
                                        <Tooltip arrow title={
                                            <>
                                                <Typography variant={"body2"}>
                                                    Sprawdź status paczki
                                                </Typography>
                                            </>
                                        }>
                                            <Button
                                                sx={{
                                                    textDecoration: "underline",
                                                    textTransform: "none",
                                                }}
                                                onClick={(e) => {
                                                    const url = row.original.courier.tracking_url.replace(
                                                        "{number}",
                                                        p.external_number || ""
                                                    );

                                                    window.open(
                                                        url,
                                                        "_blank",
                                                        "width=1200,height=800,left=400,top=200,resizable=yes,scrollbars=yes"
                                                    );
                                                }}
                                            >
                                                Numer: {p.external_number || '-'}
                                            </Button>
                                        </Tooltip>

                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )
                },
            },
            {
                accessorKey: 'cod_value',
                header: 'Pobranie',
                size: 90,
                Cell: ({cell}) => cell.getValue() ? cell.getValue() / (100) + " zł" : "Bez",
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>COD</Box>
                    </Tooltip>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Data utworzenia',
                size: 120,
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY HH:mm") : "",
                Header: ({column}) => (
                    <Tooltip title={column.columnDef.header} placement="top" arrow>
                        <Box>DU</Box>
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
                            <ShipmentMenu row={row} auth={auth}/>
                        </Box>
                    )
                },
                size: 120,
            },

        ], [props, auth]);


    const table = useMaterialReactTable({
        data,
        columns,
        enableTopToolbar: true,
        enableBottomToolbar: true,
        enableGrouping: true,
        enableColumnResizing: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        localization: MRT_Localization_PL,
        columnFilterDisplayMode: 'popover',
        initialState: {
            columnVisibility: {id: false,},
            density: 'compact',
            pagination: {pageSize: 50, pageIndex: 0},
            sorting: [
                {
                    id: 'id',
                    desc: true,
                },
            ]
        },
        muiTableContainerProps: {
            sx: {
                flex: 1,
            }
        },
        // muiTable mui Table ustawienie poprawne
        muiTablePaperProps: ({table}) => ({
            sx: {
                pl: 1,
                flex: 1,
                display: "flex",
                flexDirection: "column",
            },
            elevation: 1,
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
        muiTableBodyRowProps: ({row}) => {
            // console.log(row.original, row.original.Rozliczenie, row.original.Wartosc, row.original.DniSpoznienia)
            return ({
                sx: {
                    // bgcolor: row.original.Rozliczenie != 2 ? row.original.DniSpoznienia != null ? Number(row.original.Wartosc) > 0 ? "errorBg.main" : "" : "" : ""
                },
            })
        },
        muiBottomToolbarProps: ({row}) => {
            return ({
                sx: {
                    marginRight: '60px',
                }
            })
        },

    });


    return (
        <>
            <MaterialReactTable table={table}/>
            {auth?.permissions?.includes("createShipments") && (
                <>
                    <Box sx={{position: "absolute", bottom: 10, right: 10, zIndex: 20}}>
                        <Fab color="primary" aria-label="add" onClick={() => {
                            setOpenDialogAdd(true)
                        }}>
                            <Add/>
                        </Fab>
                    </Box>
                    <DeliveryAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd}/>
                </>
            )}
        </>
    );
}

