import {useEffect, useMemo, useState} from "react";
import {Box, Button, Fab, IconButton, Tooltip, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Add, Delete, Edit, ContentCopy, Upgrade, Visibility} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import toLocaleString from "@/Functions/toLocaleString";
import PartnersSettlementAddDialog from "@/Components/Dialogs/PartnersDialog/PartnersSettlementAddDialog";


export default function SettlementDocumentsTable({
                                                     settlementDocuments,
                                                     partner,
                                                     readOnly,
                                                     changeSettlementDocumentItems
                                                 }) {
    const theme = useTheme();
    const data = settlementDocuments ? settlementDocuments?.documents : [];
    useEffect(() => {
        console.log(settlementDocuments);
    }, [settlementDocuments]);


    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 10,
            },
            {
                accessorKey: 'name',
                header: 'Nazwa',
                size: 10,
            },
            {
                accessorKey: 'type',
                header: 'Typ',
                size: 10,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 10,
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
                Cell: ({row, cell}) => (
                    <Typography variant="body2"
                                sx={{color: row.original.price_net_computed !== row.original.price_net_original ? 'red' : 'inherit'}}>
                        {toLocaleString(cell.getValue() / 100)}
                    </Typography>

                ),
            },
            {
                accessorKey: 'price_gross_original',
                header: 'Kwota podana B',
                size: 10,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'price_gross_computed',
                header: 'Kwota wyliczona B',
                size: 10,
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

                    const handleDelete = () => {
                        // router.delete(route("system.partners.partner.export.delete", {
                        //     partner: partner.id,
                        //     export: row.original.id
                        // }), {
                        //     preserveScroll: true,
                        //     onSuccess: () => {
                        //         enqueueSnackbar("Usunięto eksport", {variant: 'success'})
                        //         // reloadData();
                        //     },
                        //     onError: errors => {
                        //         enqueueSnackbar("Błąd przy usuwaniu eksportu", {variant: 'error'})
                        //         console.error(errors)
                        //     },
                        // })

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
                            {/*<Tooltip title="Usuń rozliczenie" arrow>*/}
                            {/*    <span>*/}
                            {/*             <IconButton aria-label="delete" onClick={handleDelete} disabled={true}>*/}
                            {/*        <Delete color={!true ? "error" : ""}/>*/}
                            {/*    </IconButton>*/}
                            {/*    </span>*/}

                            {/*</Tooltip>*/}
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
        enableGrouping: false,
        enableStickyHeader: false,
        enableSorting: false,
        enableStickyFooter: false,
        enableTableFooter: false,
        renderBottomToolbar: false,
        localization: MRT_Localization_PL,
        initialState: {
            columnVisibility: {id: false, price_gross_computed: false, price_gross_original: false},
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
            // sx: {maxHeight: 350, height: 1, minHeight: 200}
        },
        // muiTableProps: {
        //     sx: {height: 1}
        // },
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
