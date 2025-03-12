import {useEffect, useMemo, useState} from "react";
import {Box, Button, Fab, IconButton, Tooltip, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Add, Delete, Edit, ContentCopy, Upgrade, Visibility, Close, Done, DoneAll} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import toLocaleString from "@/Functions/toLocaleString";
import {Invoice} from "@/Icons/Invoice";
import {InvoiceCorrection} from "@/Icons/InvoiceCorrection";
import {router} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";


export default function SettlementDocumentsTable({
                                                     settlementDocuments,
                                                     partner,
                                                     readOnly,
                                                     changeSettlementDocumentItems
                                                 }) {
    const theme = useTheme();
    const data = settlementDocuments ? settlementDocuments?.documents : [];

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
                    return (
                        <Box>
                            {cell.getValue() === 1 && (
                                <Tooltip title="Faktura" arrow>
                                    <span>
                                        <Invoice color={"success"}/>
                                    </span>
                                </Tooltip>
                            )}
                            {cell.getValue() === 2 && (
                                <Tooltip title="Korekta faktury">
                                    <span>
                                        <InvoiceCorrection color={"info"}/>
                                    </span>
                                </Tooltip>
                            )}
                        </Box>
                    )

                }
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 10,
                Cell: ({cell, row}) => {
                    return (
                        <Box>
                            {cell.getValue() === 0 && (
                                <Tooltip title="Niezaakceptowane" arrow>
                                    <span>
                                        <Close color={"error"}/>
                                    </span>
                                </Tooltip>
                            )}
                            {cell.getValue() === 1 && (
                                <Tooltip title="Zaakaceptowane do rozliczenia">
                                    <span>
                                        <Done color={"info"}/>
                                    </span>
                                </Tooltip>
                            )}
                            {cell.getValue() === 2 && (
                                <Tooltip title="Rozliczone">
                                    <span>
                                        <DoneAll color={"success"}/>
                                    </span>
                                </Tooltip>
                            )}
                        </Box>
                    )

                }
            },
            {
                accessorKey: 'quantity',
                header: 'Ilość',
                size: 10,
            },
            {
                accessorKey: 'price_net_original',
                header: 'Kwota podana N',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({row, cell}) => (
                    <Typography variant="body2"
                                sx={{color: row.original.price_net_computed !== row.original.price_net_original ? 'red' : 'inherit'}}>
                        {toLocaleString(cell.getValue() / 100)}
                    </Typography>

                ),
            },
            {
                accessorKey: 'price_net_computed',
                header: 'Kwota wyliczona N',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({row, cell}) => (
                    <Typography variant="body2"
                                sx={{color: row.original.price_net_computed !== row.original.price_net_original ? 'red' : 'inherit'}}>
                        {toLocaleString(cell.getValue() / 100)}
                    </Typography>

                ),
            },
            {
                accessorKey: 'price_net_final',
                header: 'Kwota rozliczenia N',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                    sx: {bgcolor: "primary.second"}
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({row, cell}) => (
                    <Typography variant="body2"
                                sx={{color: row.original.price_net_computed !== row.original.price_net_final ? 'success.main' : 'inherit'}}>
                        {toLocaleString(cell.getValue() / 100)}
                    </Typography>

                ),
            },
            {
                accessorKey: 'price_gross_original',
                header: 'Kwota podana B',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'price_gross_computed',
                header: 'Kwota wyliczona B',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'price_gross_final',
                header: 'Kwota rozliczenia B',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
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
                    const handleAccept = () => {
                        router.post(route("system.partners.partner.settlements.document.accept", {
                            partner: partner.id,
                            partnerSettlement: settlementDocuments?.id,
                            partnerSettlementDocument: row.original.id
                        }), {}, {
                            preserveScroll: true,
                            onSuccess: () => {
                                enqueueSnackbar("Akceptowano rozliczenie", {variant: 'success'})
                                // reloadData();
                            },
                            onError: errors => {
                                console.error(errors)
                                enqueueSnackbar("Błąd przy akceptacji rozliczenia", {variant: 'error'})
                                for (const errorsKey in errors) {
                                    enqueueSnackbar(errors[errorsKey], {variant: 'error'})
                                }
                            },
                        })
                    }

                    const handleEdit = () => {
                        changeSettlementDocumentItems(row.original);
                    }


                    return (
                        <Box>
                            <Tooltip title="Pokaż produkty" arrow>
                                <IconButton aria-label="edit" onClick={handleEdit}>
                                    <Visibility color={"info"}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Akceptuj rozliczenie" arrow>
                                <span>
                                    <IconButton aria-label="accept" onClick={handleAccept}
                                                disabled={row.original.status === 2}>
                                        <Done color={row.original.status !== 2 ? "success" : ""}/>
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                    )

                },
                size: 10,
            },
        ],
        [settlementDocuments],
        //end
    );

    const table = useMaterialReactTable({
        data,
        columns,
        enableTopToolbar: true,
        enableBottomToolbar: false,
        enableGrouping: false,
        enableStickyHeader: true,
        enableSorting: false,
        renderBottomToolbar: false,
        localization: MRT_Localization_PL,
        initialState: {
            columnVisibility: {
                id: false,
                price_gross_computed: false,
                price_gross_original: false,
                price_gross_final: false
            },
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
            sx: {maxHeight: 350, height: 1, minHeight: 200}
        },
        muiTableProps: {
            sx: {height: 1}
        },
        muiTablePaperProps: ({table}) => ({
            sx: {
                pl: 1,
                // height: 1
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
