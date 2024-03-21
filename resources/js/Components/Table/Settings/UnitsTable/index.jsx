import {DataGrid, GridToolbar, plPL} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {
    Box,
    Fab,
    IconButton,
    Tooltip
} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import DictionariesDeleteDialog from "@/Components/Dialogs/DictionariesDialog/DictionariesDeleteDialog";
import DictionariesAddDialog from "@/Components/Dialogs/DictionariesDialog/DictionariesAddDialog";

export default function UnitsTable(props) {
    const url = route(route().current()) + "/data";
    const column = [
        {field: "id", headerName: "Id"},

        {
            field: "name",
            headerName: "Nazwa",
            flex: 1
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

                const [openDialogEdit, setOpenDialogEdit] = useState(false);
                const onEditClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    setOpenDialogEdit(true);
                };

                return (
                    <>
                        <Tooltip title={"Edycja"}>
                            <IconButton aria-label="edit" onClick={onEditClick}>
                                <Edit/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={"Usuń"}>
                            <IconButton aria-label="delete" onClick={onDeleteClick}>
                                <Delete/>
                            </IconButton>
                        </Tooltip>

                        <DictionariesDeleteDialog open={openDialogDelete} setOpen={setOpenDialogDelete}
                                                  reloadData={reloadData} clickedRow={params.row}
                                                  dictionaryType={"unit"}
                                                  label={"Usuwanie jednostki"}/>

                        <DictionariesAddDialog open={openDialogEdit}
                                               setOpen={setOpenDialogEdit}
                                               reloadData={reloadData}
                                               dictionaryType={"unit"}
                                               clickedRow={params.row}
                                               routeParam={{productUnit: params.row.id}}
                        />
                    </>
                );
            }
        }
    ];
    const columnVisibility = {
        id: false
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
        // console.log(paginationModel);
        // console.log(filterModel);
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
                (paginationModel.search.length !== 0
                    ? `&search=${JSON.stringify(paginationModel.search)}`
                    : "") +
                (paginationModel.filter.length !== 0
                    ? `&filter=${JSON.stringify(paginationModel.filter)}`
                    : "");
            let option = {headers: {Accept: "application/json"}};
            const response = await fetch(fetchUrl, option);
            const json = await response.json();
            setRowCountState(json[0].total);
            // console.log("Units data: ", json[0].data)
            setPageData(json[0].data);
            setIsLoading(false);
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

            <DictionariesAddDialog open={openDialogAdd}
                                   setOpen={setOpenDialogAdd}
                                   reloadData={reloadData}
                                   dictionaryType={"unit"}
            />
        </>
    );
}

