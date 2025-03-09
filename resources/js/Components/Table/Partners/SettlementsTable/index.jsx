import {useMemo, useState} from "react";
import {Box, Button, Fab, IconButton, Tooltip} from "@mui/material";
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


export default function SettlementsTable({settlements, partner, readOnly, props, changeSettlementDocuments}) {
    const theme = useTheme();
    const data = settlements;

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
                accessorKey: 'settlement_date',
                header: 'Rozliczenie na dzień',
                size: 10,
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY") : "Nie wykonano",
            },
            {
                accessorKey: 'sold_net',
                header: 'Sprzedaż N',
                size: 10,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'sold_gross',
                header: 'Sprzedaż B',
                size: 10,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'return_net',
                header: 'Zwroty N',
                size: 10,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'return_gross',
                header: 'Zwroty B',
                size: 10,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'total_net',
                header: 'Suma N',
                size: 10,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },
            {
                accessorKey: 'total_gross',
                header: 'Suma B',
                size: 10,
                Cell: ({cell}) => toLocaleString(cell.getValue() / 100)
            },


            {
                accessorKey: 'created_at',
                header: 'Utworzenie',
                Cell: ({cell}) => cell.getValue() ? moment(cell.getValue()).format("DD-MM-YYYY HH:mm") : "Nie wykonano",
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
                        changeSettlementDocuments(row.original)
                    }


                    return (
                        <Box>
                            <Tooltip title="Pokaż dokumenty" arrow>
                                <IconButton aria-label="edit" onClick={handleEdit}>
                                    <Visibility color={"info"}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Usuń rozliczenie" arrow>
                                <span>
                                         <IconButton aria-label="delete" onClick={handleDelete} disabled={true}>
                                    <Delete color={!true ? "error" : ""}/>
                                </IconButton>
                                </span>

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
        enableGrouping: false,
        enableStickyHeader: false,
        // enableStickyFooter: true,
        localization: MRT_Localization_PL,
        initialState: {
            columnVisibility: {id: false, sold_gross: false, return_gross: false, total_gross: false},
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
            <PartnersSettlementAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} partner={partner}/>
        </>

    );
}
