import {DataGrid, GridToolbar, plPL} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {
    Box,
    Chip,
    Fab,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import {Add, Delete, Edit, Visibility} from "@mui/icons-material";
import DictionariesDeleteDialog from "@/Components/Dialogs/DictionariesDialog/DictionariesDeleteDialog";
import SizeChartDialog from "@/Components/Dialogs/DictionariesDialog/SizeChartDialog";

export default function B2CSizeChartTable() {
    const url = route(route().current()) + "/data";

    const renderPreviewTooltip = (tableData) => {
        const headers = tableData?.headers || [];
        const rows = tableData?.rows || [];
        if (!headers.length) return "Brak danych tabeli";

        return (
            <Paper sx={{p: 1, maxWidth: "85vw", overflowX: "auto"}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {headers.map((h, i) => (
                                <TableCell key={i} sx={{fontWeight: 700, py: 0.5, px: 1, whiteSpace: "nowrap"}}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((r, rI) => (
                            <TableRow key={rI}>
                                {headers.map((_, cI) => (
                                    <TableCell
                                        key={cI}
                                        sx={{
                                            fontWeight: cI === 0 ? 600 : 400,
                                            py: 0.5,
                                            px: 1,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {r[cI] ?? ""}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    };

    const column = [
        {field: "id", headerName: "Id", width: 70},
        {
            field: "name",
            headerName: "Nazwa tabeli rozmiarów",
            flex: 1,
            minWidth: 220,
        },
        {
            field: "sizes_preview",
            headerName: "Rozmiary w tabeli",
            flex: 1.5,
            minWidth: 280,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const headers = params.row.table_data?.headers || [];
                const sizes = headers.slice(1);
                return (
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center"}}>
                        {sizes.map((size, idx) => (
                            <Chip key={idx} label={size} size="small" variant="outlined"/>
                        ))}
                    </Box>
                );
            },
        },
        {
            field: "parameters_preview",
            headerName: "Parametry (wiersze)",
            flex: 1.5,
            minWidth: 260,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const rows = params.row.table_data?.rows || [];
                const paramNames = rows.map((r) => r?.[0]).filter(Boolean);
                return (
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {paramNames.join(", ")}
                    </Typography>
                );
            },
        },
        {
            field: "action",
            headerName: "Akcje",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const [openDialogDelete, setOpenDialogDelete] = useState(false);
                const [openDialogEdit, setOpenDialogEdit] = useState(false);

                const onDeleteClick = (e) => {
                    e.stopPropagation();
                    setOpenDialogDelete(true);
                };

                const onEditClick = (e) => {
                    e.stopPropagation();
                    setOpenDialogEdit(true);
                };

                return (
                    <>
                        <Tooltip
                            title={renderPreviewTooltip(params.row.table_data)}
                            placement="left"
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        bgcolor: "transparent",
                                        maxWidth: "none",
                                    },
                                },
                            }}
                        >
                            <IconButton aria-label="preview">
                                <Visibility/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Edycja">
                            <IconButton aria-label="edit" onClick={onEditClick}>
                                <Edit/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Usuń">
                            <IconButton aria-label="delete" onClick={onDeleteClick}>
                                <Delete/>
                            </IconButton>
                        </Tooltip>

                        <DictionariesDeleteDialog
                            open={openDialogDelete}
                            setOpen={setOpenDialogDelete}
                            reloadData={reloadData}
                            clickedRow={params.row}
                            dictionaryType="b2c.sizeChart"
                            label="Usuwanie tabeli rozmiarów"
                        />

                        <SizeChartDialog
                            open={openDialogEdit}
                            setOpen={setOpenDialogEdit}
                            reloadData={reloadData}
                            clickedRow={params.row}
                        />
                    </>
                );
            },
        },
    ];

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 100,
        orderBy: null,
        order: null,
        search: [],
        filter: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [rowCountState, setRowCountState] = useState(0);
    const [pageData, setPageData] = useState([]);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        id: false,
    });

    const handleSortModelChange = useCallback(
        (sortModel) => {
            setPaginationModel({
                ...paginationModel,
                orderBy: sortModel[0]?.field,
                order: sortModel[0]?.sort,
            });
        },
        [paginationModel]
    );

    const handlePaginationModelChange = useCallback(
        (newPaginationModel) => {
            setPaginationModel({
                ...paginationModel,
                page: newPaginationModel.page,
                pageSize: newPaginationModel.pageSize,
            });
        },
        [paginationModel]
    );

    const onFilterChange = useCallback(
        (filterModel) => {
            setPaginationModel({
                ...paginationModel,
                search: filterModel.quickFilterValues,
                filter: filterModel.items,
            });
        },
        [paginationModel]
    );

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            let fetchUrl =
                url +
                `?page=${paginationModel.page + 1}` +
                `&limit=${paginationModel.pageSize}` +
                (paginationModel.order ? `&order=${paginationModel.order}` : "") +
                (paginationModel.orderBy ? `&orderBy=${paginationModel.orderBy}` : "") +
                (paginationModel.search.length !== 0 ? `&search=${JSON.stringify(paginationModel.search)}` : "") +
                (paginationModel.filter.length !== 0 ? `&filter=${JSON.stringify(paginationModel.filter)}` : "");
            const response = await fetch(fetchUrl, {headers: {Accept: "application/json"}});
            const json = await response.json();
            setRowCountState(json[0].total);
            setPageData(json[0].data);
            setIsLoading(false);
        };
        fetchData();
    }, [paginationModel]);

    const reloadData = () => {
        setPaginationModel({...paginationModel});
    };

    const [openDialogAdd, setOpenDialogAdd] = useState(false);

    return (
        <>
            <DataGrid
                rows={pageData}
                columns={column}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
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
                        quickFilterProps: {debounceMs: 500},
                    },
                }}
                disableDensitySelector
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
                            color: "text.primary",
                        },
                    },
                    "& .MuiDataGrid-row.Mui-selected": {
                        bgcolor: "rgba(255,255,255,0.25)",
                    },
                    "& .MuiDataGrid-row:hover": {
                        bgcolor: "primary",
                    },
                }}
            />

            <Box sx={{position: "absolute", bottom: 10, right: 10, zIndex: 20}}>
                <Fab color="primary" aria-label="add" onClick={() => setOpenDialogAdd(true)}>
                    <Add/>
                </Fab>
            </Box>

            <SizeChartDialog open={openDialogAdd} setOpen={setOpenDialogAdd} reloadData={reloadData}/>
        </>
    );
}

