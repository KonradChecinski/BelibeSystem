import {useEffect, useMemo, useState} from "react";
import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Delete, Edit, ContentCopy, Upgrade} from '@mui/icons-material';
import moment from "moment";
import {MaterialReactTable, useMaterialReactTable} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import toLocaleString from "@/Functions/toLocaleString";
import {router} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";


export default function SettlementItemsTable({settlementDocumentItems, partner, readOnly, props}) {
    const theme = useTheme();
    // const data = settlementDocumentItems;


    const data = settlementDocumentItems ? settlementDocumentItems?.items : [];
    useEffect(() => {
        console.log(settlementDocumentItems);
    }, [settlementDocumentItems]);

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

            // {
            //     accessorKey: 'action',
            //     header: 'Akcje',
            //     columnDefType: 'display',
            //     muiTableBodyCellProps: {
            //         align: 'center',
            //     },
            //     muiTableHeadCellProps: {
            //         align: 'center',
            //     },
            //     Cell: ({cell, row}) => {
            //         // const [openEditDialog, setOpenEditDialog] = useState(false);
            //         // const handleDelete = () => {
            //         //     router.delete(route("system.partners.partner.export.delete", {
            //         //         partner: partner.id,
            //         //         export: row.original.id
            //         //     }), {
            //         //         preserveScroll: true,
            //         //         onSuccess: () => {
            //         //             enqueueSnackbar("Usunięto eksport", {variant: 'success'})
            //         //             // reloadData();
            //         //         },
            //         //         onError: errors => {
            //         //             enqueueSnackbar("Błąd przy usuwaniu eksportu", {variant: 'error'})
            //         //             console.error(errors)
            //         //         },
            //         //     })
            //         //
            //         // }
            //         // const handleEdit = () => {
            //         //     setOpenEditDialog(true)
            //         // }
            //         //
            //         // const handleRun = () => {
            //         //     router.post(route("system.partners.partner.export.runUpdate", {
            //         //         partner: partner.id,
            //         //         export: row.original.id
            //         //     }), {}, {
            //         //         preserveScroll: true,
            //         //         onSuccess: () => {
            //         //             console.log("cos")
            //         //             enqueueSnackbar("Zlecono aktualizację", {variant: 'success'})
            //         //         },
            //         //         onError: errors => {
            //         //             console.log("cos")
            //         //             enqueueSnackbar("Błąd przy zlecaniu aktualizacji", {variant: 'error'})
            //         //             console.error(errors)
            //         //         },
            //         //     })
            //         //
            //         // }
            //         //
            //         // const link = route("system.partner.show", {uuid: row.original.path})
            //         // const handleCopy = () => {
            //         //     navigator.clipboard.writeText(link)
            //         //     enqueueSnackbar("Skopiowano link", {variant: 'success'})
            //         // }
            //         //
            //         // return (
            //         //     <Box>
            //         //         <Tooltip title="Kopiuj link do pobrania zestawienia produktów dla klienta" arrow>
            //         //             <IconButton aria-label="edit" onClick={handleCopy}>
            //         //                 <ContentCopy color={"warning"}/>
            //         //             </IconButton>
            //         //         </Tooltip>
            //         //         <Tooltip title="Aktualizuj" arrow>
            //         //             <IconButton aria-label="update" onClick={handleRun}>
            //         //                 <Upgrade/>
            //         //             </IconButton>
            //         //         </Tooltip>
            //         //         <Tooltip title="Edytuj" arrow>
            //         //             <IconButton aria-label="edit" onClick={handleEdit}>
            //         //                 <Edit color={"info"}/>
            //         //             </IconButton>
            //         //         </Tooltip>
            //         //         <Tooltip title="Usuń" arrow>
            //         //             <IconButton aria-label="delete" onClick={handleDelete}>
            //         //                 <Delete color={"error"}/>
            //         //             </IconButton>
            //         //         </Tooltip>
            //         //     </Box>
            //         // )
            //
            //     },
            //     size: 10,
            // },
        ],
        [],
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
        // enableColumnResizing: true,
        enableRowNumbers: true,
        initialState: {
            columnVisibility: {id: false, price_gross_computed: false, price_gross_original: false},
            density: 'compact',
            sorting: [
                {
                    id: 'product.symbol',
                    desc: false,
                },
            ]
        },
        muiTableContainerProps: {
            // sx: {maxHeight: 350, height: 1, minHeight: 200}
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
