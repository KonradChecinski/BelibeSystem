import {useMemo, useState} from "react";
import {Box, Button, Fab, IconButton, Tooltip, Typography,} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {
    Done,
    Close,
    DownloadDone,
    BorderAll,
    Code,
    Add,
    Delete,
    Edit,
    ContentCopy,
    Upgrade,
    Sell, ShoppingCart
} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import 'cronstrue/locales/pl';
import {enqueueSnackbar} from "notistack";


export default function OrderListOtherTable({orders = [], readOnly, props}) {
    const theme = useTheme();
    const data = orders
    console.log(data)

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
                    // console.log(row.original)
                    return (
                        <Box>
                            {cell.getValue() === 0 && (
                                <Tooltip title="B2B">
                                    <Sell color={"info"}/>
                                </Tooltip>
                            )}
                            {/*{cell.getValue() === 1 && (*/}
                            {/*    <Tooltip title="Shoper">*/}
                            {/*        <ShoppingCart color={"success"}/>*/}
                            {/*    </Tooltip>*/}
                            {/*)}*/}
                        </Box>
                    )

                }
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 10,
                Cell: ({cell, row}) => {
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

                }
            },


            {
                accessorKey: 'ordered_at',
                header: 'Data',
                // columnDefType: 'display',
                width: 20,
                Cell: ({cell, row}) => {
                    let data = "";
                    switch (row.original?.type) {
                        case 0:
                            data = moment(row.original?.created_at).format("DD-MM-YYYY HH:mm:ss");
                            break;
                        default:
                            data = moment(row.original?.ordered_at).format("DD-MM-YYYY HH:mm:ss");
                            break;
                    }
                    return data
                }
            },
            {
                accessorKey: 'subiekt_number',
                header: 'Numer Subiekt',
            },
            {
                accessorKey: 'subiekt_added_at',
                header: 'Data Subiekt',
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
                    // const [openEditDialog, setOpenEditDialog] = useState(false);
                    // const handleDelete = () => {
                    //     router.delete(route("system.partners.partner.export.delete", {
                    //         partner: partner.id,
                    //         export: row.original.id
                    //     }), {
                    //         preserveScroll: true,
                    //         onSuccess: () => {
                    //             enqueueSnackbar("Usunięto eksport", {variant: 'success'})
                    //             // reloadData();
                    //         },
                    //         onError: errors => {
                    //             enqueueSnackbar("Błąd przy usuwaniu eksportu", {variant: 'error'})
                    //             console.error(errors)
                    //         },
                    //     })
                    //
                    // }
                    // const handleEdit = () => {
                    //     setOpenEditDialog(true)
                    // }

                    // const handleRun = () => {
                    //     router.post(route("system.partners.partner.export.runUpdate", {
                    //         partner: partner.id,
                    //         export: row.original.id
                    //     }), {}, {
                    //         preserveScroll: true,
                    //         onSuccess: () => {
                    //             console.log("cos")
                    //             enqueueSnackbar("Zlecono aktualizację", {variant: 'success'})
                    //         },
                    //         onError: errors => {
                    //             console.log("cos")
                    //             enqueueSnackbar("Błąd przy zlecaniu aktualizacji", {variant: 'error'})
                    //             console.error(errors)
                    //         },
                    //     })
                    //
                    // }
                    //
                    // const link = route("system.partner.show", {uuid: row.original.path})
                    const handleCopy = () => {
                        navigator.clipboard.writeText(link)
                        enqueueSnackbar("Skopiowano link", {variant: 'success'})
                    }

                    return (
                        <Box>
                            {/*<Tooltip title="Edytuj" arrow>*/}
                            {/*    <IconButton aria-label="edit">*/}
                            {/*        <Edit color={"info"}/>*/}
                            {/*    </IconButton>*/}
                            {/*</Tooltip>*/}
                            {/*<Tooltip title="Usuń" arrow>*/}
                            {/*    <IconButton aria-label="delete">*/}
                            {/*        <Delete color={"error"}/>*/}
                            {/*    </IconButton>*/}
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
        enableGrouping: true,
        enableStickyHeader: true,
        // enableStickyFooter: true,
        localization: MRT_Localization_PL,
        initialState: {
            columnVisibility: {id: false},
            density: 'compact',
            pagination: {pageSize: 50, pageIndex: 0},
            sorting: [
                {
                    id: 'ordered_at',
                    desc: true,
                },
            ]
        },
        muiTableContainerProps: {
            sx: {height: "calc(100% - 110px)"},
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
        </>

    );
}
