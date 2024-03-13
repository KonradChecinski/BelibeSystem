import {DataGrid, GridFooter, GridFooterContainer, GridToolbar, plPL} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {router} from "@inertiajs/react";
import {Box, Fab, IconButton, Tooltip} from "@mui/material";
import {Add, ContentCopy, Edit, Visibility} from "@mui/icons-material";
import ColorsCell from "@/Components/Table/Model/ModelsTable/ColorsCell";
import GroupCell from "@/Components/Table/Model/ModelsTable/GroupCell";
import ModelsAddDialog from "@/Components/Dialogs/ModelsDialog/ModelsAddDialog";
import ModelsCopyDialog from "@/Components/Dialogs/ModelsDialog/ModelsCopyDialog";

export default function ModelsTable(props) {
    const url = route(route().current()) + "/data";
    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "img",
            headerName: "Zdjęcie",
            sortable: false,
            filterable: false,
            width: 80,
            renderCell: (params) => {
                return (
                    (
                        params.row.images.filter((e) => e.order == 0 && e.type == 1).length !== 0 ?
                            <img
                                src={route("images", {path: params.row.images.filter((e) => e.order == 0 && e.type == 1)[0]?.path})}
                                alt={"Zdjęcie produktu"}
                                className={"w-100 p-1.5"}
                            />
                            : ""
                    )


                );
            }
        },
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
            type: 'actions',
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
                const [openDialogCopy, setOpenDialogCopy] = useState(false);
                const onCopyClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    setOpenDialogCopy(true);
                };

                return (
                    <>
                        {props.auth.permissions.includes("showModel") ?
                            <Tooltip title="Pokaż">
                                <IconButton aria-label="preview" onClick={onShowClick}>
                                    {/*<Preview />*/}
                                    <Visibility/>
                                </IconButton>
                            </Tooltip>
                            : ""}
                        {props.auth.permissions.includes("editModel") ?
                            <Tooltip title="Edycja">
                                <IconButton aria-label="edit" onClick={onEditClick}>
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            : ""}

                        {props.auth.permissions.includes("createModel") ?
                            <>
                                <Tooltip title="Duplikuj">
                                    <IconButton aria-label="copy" onClick={onCopyClick}>
                                        <ContentCopy/>
                                    </IconButton>
                                </Tooltip>
                                <ModelsCopyDialog open={openDialogCopy} setOpen={setOpenDialogCopy}
                                                  reloadData={reloadData} modelId={params.row.id}/>
                            </>

                            : ""}


                        {/*<Tooltip title="Usuń">*/}
                        {/*<IconButton aria-label="delete" onClick={onDeleteClick}>*/}
                        {/*    <Delete/>*/}
                        {/*</IconButton>*/}
                        {/*</Tooltip>*/}

                        {/*<ModelsDeleteDialog open={openDialogDelete} setOpen={setOpenDialogDelete}*/}
                        {/*                    reloadData={reloadData} model={params.row}/>*/}
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
            setPageData(json[0].data);
            setIsLoading(false)

            for (const model of json[0].data) {
                // console.log(model)
                let quantity = 0;
                for (const product of model.products) {
                    quantity += product.quantity
                }
                model.quantity = quantity
            }
            ;
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
            <ModelsAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} reloadData={reloadData}/>
        </>
    );

}
