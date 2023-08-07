import {DataGrid, GridToolbar, plPL, enUS} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import {
    Box,
    Button,
    Checkbox, Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    IconButton, Paper, Step, StepLabel, Stepper,
    Switch, TextField
} from "@mui/material";
import {Add, Delete, Edit, Preview, ToggleOff, Visibility} from "@mui/icons-material";
import RolesAddDialog from "@/Components/Dialogs/RolesDialog/RolesAddDialog";
import RolesDeleteDialog from "@/Components/Dialogs/RolesDialog/RolesDeleteDialog";

export default function RolesTable(props) {
    const url = route(route().current()) + "/data";
    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "name",
            headerName: "Nazwa",
            flex: 1
        },
        {
            field: "users_count",
            headerName: "Ilość użytkowników",
            width: 200
        },

        {
            field: "action",
            headerName: "Akcje",
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const [openDialogDelete, setOpenDialogDelete] = useState(false);
                const onDeleteClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    setOpenDialogDelete(true);
                };
                const onEditClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    router.get(
                        route("system.settings.roles.edit", {id: params.row.id})
                    );
                };

                return (
                    <>


                        {params.row.id !== 1 ? (
                            <>
                                {props.auth.permissions.includes("editRole") ?
                                    <IconButton aria-label="edit" onClick={onEditClick}>
                                        <Edit/>
                                    </IconButton>
                                    :
                                    ""
                                }
                                {props.auth.permissions.includes("deleteRole") ?
                                    <>
                                        <IconButton aria-label="delete" onClick={onDeleteClick}>
                                            <Delete/>
                                        </IconButton>
                                        <RolesDeleteDialog open={openDialogDelete} setOpen={setOpenDialogDelete}
                                                           reloadData={reloadData} role={params.row}/>
                                    </>
                                    :
                                    ""
                                }


                            </>
                        ) : ""
                        }

                    </>
                );
            }
        }
    ];
    const columnVisibility = {
        id: true
    };
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 100,
        orderBy: null,
        order: null,
        search: [],
        filter: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [rowCountState, setRowCountState] = useState(0);
    const [pageData, setPageData] = useState([]);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        ...columnVisibility
    });

    const handleSortModelChange = useCallback((sortModel) => {
        setPaginationModel({
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            search: paginationModel.search,
            filter: paginationModel.filter,
            orderBy: sortModel[0].field,
            order: sortModel[0].sort
        });
    }, []);
    const handlePaginationModelChange = useCallback((newPaginationModel) => {
        setPaginationModel({
            orderBy: paginationModel.orderBy,
            order: paginationModel.order,
            search: paginationModel.search,
            filter: paginationModel.filter,
            page: newPaginationModel.page,
            pageSize: newPaginationModel.pageSize
        });
    }, []);

    const onFilterChange = useCallback((filterModel) => {
        setPaginationModel({
            orderBy: paginationModel.orderBy,
            order: paginationModel.order,
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            search: filterModel.quickFilterValues,
            filter: filterModel.items
        });
        console.log(paginationModel);
        console.log(filterModel);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            let fetchUrl =
                url +
                `?page=${paginationModel.page + 1}` +
                `&limit=${paginationModel.pageSize}` +
                (paginationModel.order
                    ? `&order=${paginationModel.order}`
                    : "") +
                (paginationModel.orderBy
                    ? `&orderBy=${paginationModel.orderBy}`
                    : "") +
                (paginationModel.search.length != 0
                    ? `&search=${JSON.stringify(paginationModel.search)}`
                    : "") +
                (paginationModel.filter.length != 0
                    ? `&filter=${JSON.stringify(paginationModel.filter)}`
                    : "");
            let option = {headers: {Accept: "application/json"}};
            const response = await fetch(fetchUrl, option);
            const json = await response.json();
            setRowCountState(json[0].total);
            setPageData(json[0].data);
            setIsLoading(false);
            // console.log(pageData)
        };
        fetchData();

    }, [paginationModel]);

    const reloadData = () => {
        setPaginationModel({...paginationModel})
    }

    const [openDialogAdd, setOpenDialogAdd] = useState(false);

    return (
        <>
            <DataGrid
                rows={pageData}
                columns={column}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                }
                rowCount={rowCountState}
                loading={isLoading}
                pageSizeOptions={[5, 20, 50, 100]}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                sortingMode="server"
                onSortModelChange={handleSortModelChange}
                filterMode="server"
                onFilterModelChange={onFilterChange}
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
                rowHeight={80}
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

            <RolesAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} reloadData={reloadData}/>
        </>
    );
}

