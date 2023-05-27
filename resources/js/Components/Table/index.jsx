import { DataGrid, GridToolbar, plPL, enUS } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";

export default function Table({ url, column, columnVisibility }) {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 100,
        orderBy: null,
        order: null,
        search: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [rowCountState, setRowCountState] = useState(0);
    const [pageData, setPageData] = useState([]);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        ...columnVisibility,
    });

    const columnWithAction = [
        ...column,
        {
            field: "action",
            headerName: "Akcje",
            width: 200,
            sortable: false,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    return alert(JSON.stringify(params.row, null, 4));
                };

                return <Button onClick={onClick}>Click</Button>;
            },
        },
    ];

    const handleSortModelChange = useCallback((sortModel) => {
        setPaginationModel({
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            search: paginationModel.search,
            orderBy: sortModel[0].field,
            order: sortModel[0].sort,
        });
    }, []);
    const handlePaginationModelChange = useCallback((newPaginationModel) => {
        setPaginationModel({
            orderBy: paginationModel.orderBy,
            order: paginationModel.order,
            search: paginationModel.search,
            page: newPaginationModel.page,
            pageSize: newPaginationModel.pageSize,
        });
    }, []);

    const onFilterChange = useCallback((filterModel) => {
        setPaginationModel({
            orderBy: paginationModel.orderBy,
            order: paginationModel.order,
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            search: filterModel.quickFilterValues,
        });
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
                    : "");
            let option = { headers: { Accept: "application/json" } };
            const response = await fetch(fetchUrl, option);
            const json = await response.json();
            setRowCountState(json[0].total);
            setPageData(json[0].data);
            setIsLoading(false);
        };
        fetchData();
    }, [paginationModel]);

    return (
        <DataGrid
            rows={pageData}
            columns={columnWithAction}
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
            slots={{ toolbar: GridToolbar }}
            slotProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                },
            }}
            // disableColumnFilter
            //disableColumnSelector
            disableDensitySelector
            autoHeight
            pagination
            localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
            sx={{
                boxShadow: 2,
                border: 2,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                },
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
