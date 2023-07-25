import {DataGrid, GridToolbar, plPL, enUS} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import {Button, IconButton} from "@mui/material";
import {Add, Delete, Edit, Preview, Visibility} from "@mui/icons-material";
import ColorsCell from "@/Components/Table/ModelsTable/ColorsCell";
import GroupCell from "@/Components/Table/ModelsTable/GroupCell";
import RolesDeleteDialog from "@/Components/Dialogs/RolesDialog/RolesDeleteDialog";
import ModelsDeleteDialog from "@/Components/Dialogs/ModelsDialog/ModelsDeleteDialog";

export default function ModelsTable(props) {
    const url = route(route().current()) + "/data";
    const column = [
        {field: "id", headerName: "Id"},
        {field: "img", headerName: "Zdjęcie", sortable: false, filterable: false},
        {field: "symbol", headerName: "Symbol"},

        {
            field: "name",
            headerName: "Name",
            width: 400
        },
        {
            field: "group.name", headerName: "Grupa", renderCell: (params) => {
                return <GroupCell key={params.row.id} group={params.row.group}/>;
            },
            sortable: false,
            filterable: false
        },
        {
            field: "colors",
            headerName: "Kolory",
            sortable: false,
            renderCell: (params) => {
                return <ColorsCell key={params.row.id} colors={params.row.colors}/>;
            },
            flex: 1,
            filterable: false
        },
        {field: "quantity", headerName: "Stan", filterable: false},
        {
            field: "action",
            headerName: "Akcje",
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const onShowClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    router.get(
                        route("system.products.model", {id: params.row.id})
                    );
                };
                const onEditClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    // return alert(JSON.stringify(params.row, null, 4));
                    router.get(
                        route("system.products.model.edit", {id: params.row.id})
                    );
                };
                const [openDialogDelete, setOpenDialogDelete] = useState(false);
                const onDeleteClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    setOpenDialogDelete(true);
                };

                return (
                    <>
                        <IconButton aria-label="preview" onClick={onShowClick}>
                            {/*<Preview />*/}
                            <Visibility/>
                        </IconButton>
                        <IconButton aria-label="edit" onClick={onEditClick}>
                            <Edit/>
                        </IconButton>
                        <IconButton aria-label="delete" onClick={onDeleteClick}>
                            <Delete/>
                        </IconButton>

                        <ModelsDeleteDialog open={openDialogDelete} setOpen={setOpenDialogDelete}
                                            reloadData={reloadData} model={params.row}/>
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
        };
        fetchData();
    }, [paginationModel]);

    const reloadData = () => {
        setPaginationModel({...paginationModel})
    }

    return (
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
    );
}

//
// export default function Table({url, column, reloadData}) {
//     const [paginationModel, setPaginationModel] = useState({
//         page: 0,
//         pageSize: 20,
//         orderBy: null,
//         order: null,
//         search: []
//     });
//     const [isLoading, setIsLoading] = useState(true);
//     const [rowCountState, setRowCountState] = useState(0);
//     const [pageData, setPageData] = useState([]);
//
//     const columnWithAction = [...column, {field: "action", headerName: "Akcje", width: 200},]
//
//     const handleSortModelChange = useCallback((sortModel) => {
//         setPaginationModel({
//             page: paginationModel.page,
//             pageSize: paginationModel.pageSize,
//             search: paginationModel.search,
//             orderBy: sortModel[0].field,
//             order: sortModel[0].sort
//         });
//     }, []);
//     const handlePaginationModelChange = useCallback((newPaginationModel) => {
//         setPaginationModel({
//             orderBy: paginationModel.orderBy,
//             order: paginationModel.order,
//             search: paginationModel.search,
//             page: newPaginationModel.page,
//             pageSize: newPaginationModel.pageSize
//         });
//     }, []);
//
//     const onFilterChange = useCallback((filterModel) => {
//         setPaginationModel({
//             orderBy: paginationModel.orderBy,
//             order: paginationModel.order,
//             page: paginationModel.page,
//             pageSize: paginationModel.pageSize,
//             search: filterModel.quickFilterValues
//         });
//     }, []);
//
//     const fetchData = async () => {
//         setIsLoading(true);
//         let fetchUrl = url +
//             `?page=${paginationModel.page + 1}` +
//             `&limit=${paginationModel.pageSize}` +
//             (paginationModel.order ? `&order=${paginationModel.order}` : "") +
//             (paginationModel.orderBy ? `&orderBy=${paginationModel.orderBy}` : "") +
//             (paginationModel.search.length != 0 ? `&search=${JSON.stringify(paginationModel.search)}` : "");
//         let option = {headers: {"Accept": "application/json"}};
//         const response = await fetch(fetchUrl, option);
//         const json = await response.json();
//         setRowCountState(json[0].total);
//         setPageData(json[0].data);
//         setIsLoading(false);
//     };
//
//     useEffect(() => {
//         fetchData();
//     }, [paginationModel]);
//
//     useImperativeHandle(reloadData, () => ({
//         reloadData() {
//             fetchData();
//         }
//     }));
//
//     return (
//         <DataGrid
//             rows={pageData}
//             columns={columnWithAction}
//             rowCount={rowCountState}
//             loading={isLoading}
//             pageSizeOptions={[5, 20, 50, 100]}
//             paginationMode="server"
//             paginationModel={paginationModel}
//             onPaginationModelChange={handlePaginationModelChange}
//             sortingMode="server"
//             onSortModelChange={handleSortModelChange}
//             filterMode="server"
//             onFilterModelChange={onFilterChange}
//             slots={{toolbar: GridToolbar}}
//             slotProps={{
//                 toolbar: {
//                     showQuickFilter: true,
//                     quickFilterProps: {debounceMs: 500}
//                 }
//             }}
//             // disableColumnFilter
//             disableColumnSelector
//             disableDensitySelector
//             autoHeight
//             pagination
//             localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
//         />
//     );
//
// }
