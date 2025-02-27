import {useMemo, useState} from "react";
import {Box, Button, Fab, IconButton, Tooltip, Typography,} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Delete, Add} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import {Link, router} from "@inertiajs/react";
import PartnersExportProductAddDialog from "@/Components/Dialogs/PartnersDialog/PartnersExportProductAddDialog";
import {enqueueSnackbar} from "notistack";


export default function ProductsTable({products, readOnly, props, partner}) {
    const theme = useTheme();
    const data = products;

    const [openDialogAdd, setOpenDialogAdd] = useState(false);


    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 10,
            },
            {
                accessorKey: 'symbol',
                header: 'Symbol',
            },
            {
                accessorKey: 'name',
                header: 'Nazwa',
                size: 50,
            },
            {
                accessorKey: 'quantity',
                header: 'Ilość',
                size: 50,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
            },
            {
                accessorKey: 'pivot.created_at',
                header: 'Dodano',
                size: 50,
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY HH:mm") : "",
                enableColumnDragging: false,
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
                        router.delete(route("system.partners.partner.products.delete", {
                            partner: partner.id,
                            product: row.original.id
                        }), {
                            preserveScroll: true,
                            onSuccess: () => {
                                enqueueSnackbar("Usunięto produkt", {variant: 'success'})
                                // reloadData();
                            },
                            onError: errors => {
                                enqueueSnackbar("Błąd przy usuwaniu produktu", {variant: 'error'})
                                console.error(errors)
                            },
                        })

                    }
                    return (
                        <Box>
                            <Tooltip title="Usuń" arrow>
                                <IconButton aria-label="delete" onClick={handleDelete}>
                                    <Delete color={"error"}/>
                                </IconButton>
                            </Tooltip>
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
        autoResetPageIndex: false,
        initialState: {
            columnVisibility: {id: false},
            density: 'compact',
            pagination: {pageSize: 50, pageIndex: 0},
            sorting: [
                {
                    id: 'symbol',
                    desc: false,
                },
            ]
        },
        muiTableContainerProps: {
            sx: {maxHeight: 550, height: 1, minHeight: 500}
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
            <Box sx={{position: "absolute", bottom: 0, right: 0, zIndex: 20}}>
                <Fab color="primary" aria-label="add" onClick={() => {
                    setOpenDialogAdd(true)
                }}>
                    <Add/>
                </Fab>
            </Box>
            <PartnersExportProductAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} partner={partner}
                                            products={products}/>
        </>
    );
}
