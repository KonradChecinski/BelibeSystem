import {DataGrid, GridFooter, GridFooterContainer, GridToolbar, plPL} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import {Box, Button, Fab, IconButton, Tooltip, Typography} from "@mui/material";
import {Add, ContentCopy, Delete, Edit, Visibility} from "@mui/icons-material";
import ClientsAddDialog from "@/Components/Dialogs/ClientsDialog/ClientsAddDialog";
import moment from "moment";
import {enqueueSnackbar} from "notistack";
import PartnersAddDialog from "@/Components/Dialogs/PartnersDialog/PartnersAddDialog";

export default function PartnersTable(props) {

    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "name",
            headerName: "Nazwa",
            filterable: true,
            flex: 1
        },
        // {field: "slug", headerName: "Url", filterable: false, width: 110},
        // {
        //     field: "created_at",
        //     headerName: "Stworzono",
        //     filterable: true,
        //     width: 150,
        //     valueGetter: (params) => {
        //         let date = moment(params.value)
        //         return date.format("YYYY-MM-DD HH:mm")
        //     }
        // },
        // {
        //     field: "updated_at",
        //     headerName: "Ostatnia edycja",
        //     filterable: true,
        //     width: 200,
        //     valueGetter: (params) => {
        //         let date = moment(params.value)
        //         return date.format("YYYY-MM-DD HH:mm")
        //     }
        // },
        {
            field: "action",
            headerName: "Akcje",
            width: 400,
            type: 'actions',
            sortable: false,
            filterable: false,
            renderCell: (params) => {

                const onEditClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    router.visit(
                        route("system.partners.partner.edit", {partner: params.row.id})
                    );
                };

                const onSettlementsClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    router.visit(
                        route("system.partners.partner.settlements", {partner: params.row.id})
                    );
                }

                const onExportClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    router.visit(
                        route("system.partners.partner.export", {partner: params.row.id})
                    );
                }

                const onDeleteClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    router.delete(
                        route("system.partners.partner.delete", {partner: params.row.id}), {
                            onSuccess: () => {
                                enqueueSnackbar("Partner został usunięty", {variant: "success"});
                                setPartnersData(partnersData.filter((partner) => partner.id !== params.row.id));
                            },
                            onError: (error) => {
                                enqueueSnackbar("Wystąpił błąd podczas usuwania partnera", {variant: "error"});
                            }
                        }
                    );
                };

                return (
                    <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end", width: 1}}>

                        {props.auth.permissions.includes("editPartners") ?
                            <Tooltip title="Rozliczenia">
                                <Button variant="outlined" aria-label="edit" onClick={onSettlementsClick}>
                                    Rozliczenia
                                </Button>
                            </Tooltip>
                            : ""}

                        {props.auth.permissions.includes("editPartners") ?
                            <Tooltip title="Eksport stanów">
                                <Button variant="outlined" aria-label="edit" onClick={onExportClick}>
                                    Eksport stanów
                                </Button>
                            </Tooltip>
                            : ""}

                        {props.auth.permissions.includes("editPartners") ?
                            <Tooltip title="Edycja">
                                <IconButton aria-label="edit" onClick={onEditClick}>
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            : ""}

                        {props.auth.permissions.includes("deletePartners") ?

                            <Tooltip title="Usuń">
                                <IconButton aria-label="delete" onClick={onDeleteClick}>
                                    <Delete/>
                                </IconButton>
                            </Tooltip>
                            : ""}
                    </Box>
                );
            }
        }
    ];
    const columnVisibility = {
        id: false,
    };

    const [partnersData, setPartnersData] = useState(props.partners);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        ...columnVisibility
    });
    const [openDialogAdd, setOpenDialogAdd] = useState(false);


    const reloadData = () => {
        router.reload({
            preserveState: true,
            preserveScroll: true
        });
    }

    useEffect(() => {
        setPartnersData(props.partners);
    }, [props]);


    return (
        <>
            <DataGrid
                rows={partnersData}
                columns={column}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                }
                pageSizeOptions={[5, 20, 50, 100]}
                slots={{toolbar: GridToolbar}}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: {debounceMs: 500}
                    }
                }}
                // disableColumnFilter
                //disableColumnSelector
                disableDensitySelector
                // autoHeight
                rowHeight={100}
                pagination
                localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
                sx={{
                    height: "100%",
                    boxShadow: 2,
                    border: 2,
                    borderColor: "primary.light",
                    "& .MuiDataGrid-toolbarContainer": {
                        "& .MuiButton-root": {
                            color: "text.primary"
                        }
                    },
                    "& .MuiDataGrid-row.Mui-selected": {
                        bgcolor: "rgba(255,255,255,0.25)"
                    },
                    "& .MuiDataGrid-row:hover": {
                        bgcolor: "primary"
                    },
                    "& .MuiTablePagination-root": {
                        mr: 10
                    }
                }}
            />
            <Box sx={{position: "absolute", bottom: 10, right: 10, zIndex: 20}}>
                <Fab color="primary" aria-label="add" onClick={() => {
                    setOpenDialogAdd(true)
                }}>
                    <Add/>
                </Fab>
            </Box>
            <PartnersAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} reloadData={reloadData}/>
        </>
    );

}
