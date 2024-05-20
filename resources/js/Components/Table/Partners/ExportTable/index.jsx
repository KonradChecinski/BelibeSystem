import {useMemo, useState} from "react";
import {Box, Button, Fab, IconButton, Tooltip, Typography,} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Done, Close, DownloadDone, BorderAll, Code, Add, Delete, Edit, ContentCopy, Upgrade} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import toLocaleString from "@/Functions/toLocaleString";
import {Link, router} from "@inertiajs/react";
import cronstrue from 'cronstrue';
import 'cronstrue/locales/pl';
import PartnersExportAddDialog from "@/Components/Dialogs/PartnersDialog/PartnersExportAddDialog";
import {enqueueSnackbar} from "notistack";


export default function ExportTable({exports, partner, readOnly, props}) {
    const theme = useTheme();
    const data = exports;

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
                accessorKey: 'type',
                header: 'Typ',
                size: 10,
                Cell: ({cell, row}) => {
                    return (
                        <Box>
                            {cell.getValue() === 1 && (
                                <Tooltip title="XML">
                                    <Code color={"success"}/>
                                </Tooltip>
                            )}
                            {cell.getValue() === 2 && (
                                <Tooltip title="Excel">
                                    <BorderAll color={"success"}/>
                                </Tooltip>
                            )}
                        </Box>
                    )

                }
            },
            {
                accessorKey: 'cron',
                header: 'Częstotliwość',
                columnDefType: 'display',
                width: 150,
                Cell: ({cell}) => cronstrue.toString(cell.getValue(), {locale: 'pl'}),
            },

            {
                accessorKey: 'completed_at',
                header: 'Ostatnia aktualizacja',
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
                    const [openEditDialog, setOpenEditDialog] = useState(false);
                    const handleDelete = () => {
                        router.delete(route("system.partners.partner.export.delete", {
                            partner: partner.id,
                            export: row.original.id
                        }), {
                            preserveScroll: true,
                            onSuccess: () => {
                                enqueueSnackbar("Usunięto eksport", {variant: 'success'})
                                // reloadData();
                            },
                            onError: errors => {
                                enqueueSnackbar("Błąd przy usuwaniu eksportu", {variant: 'error'})
                                console.error(errors)
                            },
                        })

                    }
                    const handleEdit = () => {
                        setOpenEditDialog(true)
                    }

                    const handleRun = () => {
                        router.post(route("system.partners.partner.export.runUpdate", {
                            partner: partner.id,
                            export: row.original.id
                        }), {}, {
                            preserveScroll: true,
                            onSuccess: () => {
                                console.log("cos")
                                enqueueSnackbar("Zlecono aktualizację", {variant: 'success'})
                            },
                            onError: errors => {
                                console.log("cos")
                                enqueueSnackbar("Błąd przy zlecaniu aktualizacji", {variant: 'error'})
                                console.error(errors)
                            },
                        })

                    }

                    const link = route("system.partner.show", {uuid: row.original.path})
                    const handleCopy = () => {
                        navigator.clipboard.writeText(link)
                        enqueueSnackbar("Skopiowano link", {variant: 'success'})
                    }

                    return (
                        <Box>
                            <Tooltip title="Kopiuj link do pobrania zestawienia produktów dla klienta" arrow>
                                <IconButton aria-label="edit" onClick={handleCopy}>
                                    <ContentCopy color={"warning"}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Aktualizuj" arrow>
                                <IconButton aria-label="update" onClick={handleRun}>
                                    <Upgrade/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edytuj" arrow>
                                <IconButton aria-label="edit" onClick={handleEdit}>
                                    <Edit color={"info"}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Usuń" arrow>
                                <IconButton aria-label="delete" onClick={handleDelete}>
                                    <Delete color={"error"}/>
                                </IconButton>
                            </Tooltip>
                            <PartnersExportAddDialog open={openEditDialog} setOpen={setOpenEditDialog} partner={partner}
                                                     exportElement={row.original}/>
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
        initialState: {
            columnVisibility: {id: false},
            density: 'compact',
            pagination: {pageSize: 50, pageIndex: 0},
            // sorting: [
            //     {
            //         id: 'nzf_Data',
            //         desc: true,
            //     },
            // ]
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
            <PartnersExportAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} partner={partner}/>
        </>

    );
}
