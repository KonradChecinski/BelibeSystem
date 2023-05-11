import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";

export default function Table({ url }) {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 100,
        orderBy: null,
        order: null,
        search: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [rowCountState, setRowCountState] = useState(0);
    const [pageData, setPageData] = useState([]);

    const handleSortModelChange = useCallback((sortModel) => {
        setPaginationModel({
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            search: paginationModel.search,
            orderBy: sortModel[0].field,
            order: sortModel[0].sort
        });
    }, []);
    const handlePaginationModelChange = useCallback((newPaginationModel) => {
        setPaginationModel({
            orderBy: paginationModel.orderBy,
            order: paginationModel.order,
            search: paginationModel.search,
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
            search: filterModel.quickFilterValues
        });
    }, []);

    useEffect(() => {
        console.log(paginationModel);
        const fetchData = async () => {
            setIsLoading(true);
            let fetchUrl = url +
                `?page=${paginationModel.page + 1}` +
                `&limit=${paginationModel.pageSize}` +
                (paginationModel.order ? `&order=${paginationModel.order}` : "") +
                (paginationModel.orderBy ? `&orderBy=${paginationModel.orderBy}` : "") +
                (paginationModel.search.length != 0 ? `&search=${JSON.stringify(paginationModel.search)}` : "");
            let option = { headers: { "Accept": "application/json" } };
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
            columns={[{ field: "id", headerName: "Id" },
                { field: "symbol", headerName: "Symbol" }, {
                    field: "name",
                    headerName: "Name", width: 300
                }]}
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
                    quickFilterProps: { debounceMs: 500 }
                }
            }}
            // disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            autoHeight
            pagination
        />
    );

}
