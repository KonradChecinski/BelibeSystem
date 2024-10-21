import {DataGrid, GridFooter, GridFooterContainer, GridToolbar, plPL} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import {Box, Fab, IconButton, Tooltip, Typography} from "@mui/material";
import {Add, ContentCopy, Delete, Edit, Visibility} from "@mui/icons-material";
import ClientsAddDialog from "@/Components/Dialogs/ClientsDialog/ClientsAddDialog";
import moment from "moment";
import {enqueueSnackbar} from "notistack";

export default function PagesTable(props) {

    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "title",
            headerName: "Tytuł",
            filterable: true,
            flex: 1
        },
        {field: "slug", headerName: "Url", filterable: false, width: 110},
        {
            field: "created_at",
            headerName: "Stworzono",
            filterable: true,
            width: 150,
            valueGetter: (params) => {
                let date = moment(params.value)
                return date.format("YYYY-MM-DD HH:mm")
            }
        },
        {
            field: "updated_at",
            headerName: "Ostatnia edycja",
            filterable: true,
            width: 200,
            valueGetter: (params) => {
                let date = moment(params.value)
                return date.format("YYYY-MM-DD HH:mm")
            }
        },
        {
            field: "action",
            headerName: "Akcje",
            width: 120,
            type: 'actions',
            sortable: false,
            filterable: false,
            renderCell: (params) => {

                const onEditClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    router.visit(
                        route("system.pages.page.edit", {dynamicPage: params.row.id})
                    );
                };

                const onDeleteClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    router.delete(
                        route("system.pages.page.delete", {dynamicPage: params.row.id}), {
                            onSuccess: () => {
                                enqueueSnackbar("Strona została usunięta", {variant: "success"});
                                setPageData(pageData.filter((page) => page.id !== params.row.id));
                            },
                            onError: (error) => {
                                enqueueSnackbar("Wystąpił błąd podczas usuwania strony", {variant: "error"});
                            }
                        }
                    );
                };

                return (
                    <>
                        {props.auth.permissions.includes("editPages") ?
                            <Tooltip title="Edycja">
                                <IconButton aria-label="edit" onClick={onEditClick}>
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            : ""}

                        {props.auth.permissions.includes("editPages") ?

                            <Tooltip title="Usuń">
                                <IconButton aria-label="delete" onClick={onDeleteClick}>
                                    <Delete/>
                                </IconButton>
                            </Tooltip>
                            : ""}
                    </>
                );
            }
        }
    ];
    const columnVisibility = {
        id: false,
    };

    const [pageData, setPageData] = useState(props.pages);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        ...columnVisibility
    });


    const handleAdd = () => {
        router.visit(route("system.pages.page"));
    }

    return (
        <>
            <DataGrid
                rows={pageData}
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
                <Fab color="primary" aria-label="add" onClick={handleAdd}>
                    <Add/>
                </Fab>
            </Box>
        </>
    );

}
