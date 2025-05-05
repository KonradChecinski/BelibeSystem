import {useMemo, useState} from "react";
import {Box, Button, Fab, IconButton, Tooltip} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Add, Delete, Edit, ContentCopy, Upgrade, Visibility, DoneAll} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import toLocaleString from "@/Functions/toLocaleString";
import PartnersSettlementAddDialog from "@/Components/Dialogs/PartnersDialog/PartnersSettlementAddDialog";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";


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
                size: 10
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
                    const {delete: destroy, processing} = useForm()

                    const handleDelete = () => {
                        destroy(route("system.partners.partner.settlements.document.delete", {
                            partner: partner.id,
                            partnerSettlement: row.original.id
                        }), {
                            preserveScroll: true,
                            onSuccess: () => {
                                enqueueSnackbar("Usunięto rozliczenie", {variant: 'success'})
                                // reloadData();
                            },
                            onError: errors => {
                                enqueueSnackbar("Błąd przy usuwaniu rozliczenia", {variant: 'error'})
                                console.error(errors)
                            },
                        })

                    }
                    const handleAcceptAll = () => {
                        router.post(route("system.partners.partner.settlements.document.acceptAll", {
                            partner: partner.id,
                            partnerSettlement: row.original.id
                        }), {
                            preserveScroll: true,
                            onSuccess: () => {
                                enqueueSnackbar("Zaakceptowano wszystkie dokumenty", {variant: 'success'})
                                // reloadData();
                            },
                            onError: errors => {
                                console.error(errors)
                                enqueueSnackbar("Błąd przy akceptacji wszystkich dokumentów", {variant: 'error'})
                                for (const errorsKey in errors) {
                                    enqueueSnackbar(errors[errorsKey], {variant: 'error'})
                                }
                            },
                        })
                    }
                    const handleEdit = () => {
                        changeSettlementDocuments(row.original)
                    }

                    const hasDocumentWithStatusOtherThanZero = row.original.documents.some(doc => doc.status !== 0)
                    const hasDocumentWithStatusZero = row.original.documents.some(doc => doc.status === 0)

                    return (
                        <Box>
                            <Tooltip title="Pokaż dokumenty" arrow>
                                <IconButton aria-label="edit" onClick={handleEdit}>
                                    <Visibility color={"info"}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Zaakceptuj wszystkie" arrow>
                                <span>
                                    <IconButton aria-label="edit" onClick={handleAcceptAll}
                                                disabled={!hasDocumentWithStatusZero}>
                                        <DoneAll color={hasDocumentWithStatusZero ? "success" : ""}/>
                                    </IconButton>
                                </span>

                            </Tooltip>
                            <Tooltip title="Usuń rozliczenie" arrow>
                                <span>
                                    <IconButton aria-label="delete" onClick={handleDelete}
                                                disabled={hasDocumentWithStatusOtherThanZero || processing}>
                                        <Delete color={!hasDocumentWithStatusOtherThanZero ? "error" : ""}/>
                                    </IconButton>
                                </span>

                            </Tooltip>
                        </Box>
                    )

                },
                size: 80,
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

    const hasDocumentWithStatusZero = settlements.some(settlement =>
        settlement.documents.some(doc => doc.status === 0)
    );

    return (
        <>
            <MaterialReactTable table={table}/>
            <Box sx={{position: "absolute", bottom: 0, right: 0, zIndex: 20}}>

                <Tooltip
                    title={hasDocumentWithStatusZero ? "Nie możesz dodać następnego rozliczenia dopóki jest inny nierozliczony" : "Dodaj"}
                    arrow>
                    <span>
                        <Fab color="primary" aria-label="add"
                             disabled={hasDocumentWithStatusZero}
                             onClick={() => {
                                 setOpenDialogAdd(true)
                             }}>
                            <Add/>
                        </Fab>
                    </span>
                </Tooltip>

            </Box>
            <PartnersSettlementAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} partner={partner}/>
        </>

    );
}
