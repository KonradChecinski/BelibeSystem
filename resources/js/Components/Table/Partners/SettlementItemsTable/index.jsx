import {useEffect, useMemo, useState} from "react";
import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Edit} from '@mui/icons-material';
import {MaterialReactTable, useMaterialReactTable} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import toLocaleString from "@/Functions/toLocaleString";
import PartnersSettlementItemEditDialog from "@/Components/Dialogs/PartnersDialog/PartnersSettlementItemEditDialog";


export default function SettlementItemsTable({settlementDocuments, settlementDocumentItems, partner, readOnly, props}) {
    const theme = useTheme();
    const data = settlementDocumentItems ? settlementDocumentItems?.items : [];

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
                size: 150,
            },
            {
                accessorKey: 'quantity',
                header: 'Ilość',
                size: 100,
            },
            {
                accessorKey: 'price_net_original',
                header: 'Netto podana',
                size: 120,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                enableSorting: false,
                Cell: ({row, cell}) => (
                    <Typography variant="body2"
                                sx={{color: row.original.price_net_computed !== row.original.price_net_original ? 'red' : 'inherit'}}>
                        {toLocaleString(cell.getValue() / 100)}
                    </Typography>

                ),
            },
            {
                accessorKey: 'price_net_computed',
                header: 'Netto wyliczona',
                size: 80,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                enableSorting: false,
                Cell: ({row, cell}) => (
                    <Typography variant="body2"
                                sx={{color: row.original.price_net_computed !== row.original.price_net_original ? 'red' : 'inherit'}}>
                        {toLocaleString(cell.getValue() / 100)}
                    </Typography>

                ),
            },
            {
                accessorKey: 'price_net_final',
                header: 'Netto rozliczenia',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                    sx: {bgcolor: "primary.second"}
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                enableSorting: false,
                Cell: ({row, cell}) => (
                    <Typography variant="body2"
                                sx={{color: row.original.price_net_computed !== row.original.price_net_final ? 'success.main' : 'inherit'}}>
                        {toLocaleString(cell.getValue() / 100)}
                    </Typography>

                ),
            },
            {
                accessorKey: 'price_gross_original',
                header: 'Brutto podana',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                enableSorting: false,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'price_gross_computed',
                header: 'Brutto wyliczona',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                enableSorting: false,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'price_gross_final',
                header: 'Brutto rozliczenia',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'right',
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                enableSorting: false,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'action',
                header: 'Akcje',
                columnDefType: 'display',
                size: 10,
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell, row}) => {

                    const [open, setOpen] = useState(false);
                    const handleEdit = () => {
                        setOpen(true);
                    }

                    return (
                        <Box>
                            <Tooltip title="Edytuj cenę" arrow>
                                <span>
                                      <IconButton aria-label="edit" onClick={handleEdit}
                                                  disabled={settlementDocumentItems.type !== 1}>
                                        <Edit color={settlementDocumentItems.type === 1 ? "info" : ""}/>
                                      </IconButton>
                                </span>

                            </Tooltip>
                            <PartnersSettlementItemEditDialog
                                key={settlementDocuments.id + settlementDocumentItems.id + row.original.id}
                                open={open}
                                setOpen={setOpen}
                                price_net_original={row.original.price_net_original}
                                price_net_computed={row.original.price_net_computed}
                                price_net_final={row.original.price_net_final}

                                partnerId={partner.id}
                                partnerSettlementId={settlementDocuments.id}
                                partnerSettlementDocumentId={settlementDocumentItems.id}
                                partnerSettlementItemId={row.original.id}
                            />
                        </Box>
                    )

                },
            }
        ],
        [settlementDocuments, settlementDocumentItems],
        //end
    );

    const table = useMaterialReactTable({
        data,
        columns,
        enableTopToolbar: true,
        enableBottomToolbar: false,
        enableGrouping: false,
        enableSorting: true,
        localization: MRT_Localization_PL,
        enablePagination: false,
        enableStickyHeader: true,
        // enableColumnResizing: true,
        enableRowNumbers: true,
        initialState: {
            columnVisibility: {
                id: false,
                price_gross_computed: false,
                price_gross_original: false,
                price_gross_final: false
            },
            density: 'compact',
            sorting: [
                {
                    id: 'product.symbol',
                    desc: false,
                },
            ]
        },
        muiTableContainerProps: {
            // sx: {maxHeight: 350, height: 1}
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
