import {DataGrid, GridToolbar, plPL} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {Box, Checkbox, Fab, IconButton, Switch, Tooltip} from "@mui/material";
import {Add, Edit} from "@mui/icons-material";
import RoleCell from "@/Components/Table/UsersTable/RoleCell";
import UserAvatar from "@/Components/UserAvatar";
import UserAddDialog from "@/Components/Dialogs/UserDialog/UserAddDialog";

export default function UsersTable(props) {
    const url = route(route().current()) + "/data";
    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "image",
            headerName: "Zdjęcie",
            width: 100,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <UserAvatar user={params.row}/>
                );
            }
        },
        {
            field: "name",
            headerName: "Nazwa",
            width: 300
        },
        {
            field: "email",
            headerName: "Email",
            width: 300
        },
        {
            field: "email_verified_at",
            headerName: "Zweryfikowany",
            width: 150,
            sortable: true,
            filterable: true,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                return (
                    <Checkbox
                        disabled={true}
                        checked={!!params.row.email_verified_at}
                        sx={{"& .MuiSvgIcon-root": {fontSize: 28}}}
                    />


                );
            }
        },
        {
            field: "activate",
            headerName: "Aktywność",
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <Switch
                        checked={true}
                        // onChange={handleChange}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                );
            }
        },
        {
            field: "roles",
            headerName: "Role",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <RoleCell roles={params.row.roles}/>
                );
            }
        },


        //
        // {
        //     field: "group.name", headerName: "Grupa", renderCell: (params) => {
        //         return <GroupCell key={params.row.id} group={params.row.group}/>;
        //     },
        //     sortable: false,
        //     filterable: false
        // },
        // {
        //     field: "colors",
        //     headerName: "Kolory",
        //     sortable: false,
        //     renderCell: (params) => {
        //         return <ColorsCell key={params.row.id} colors={params.row.colors}/>;
        //     },
        //     flex: 1,
        //     filterable: false
        // },
        // {field: "quantity", headerName: "Stan", filterable: false},
        {
            field: "action",
            headerName: "Akcje",
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const [openDialogAdd, setOpenDialogAdd] = useState(false);

                const onEditClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    setOpenDialogAdd(true)
                };

                return (
                    <>
                        <Tooltip title={"Edycja"}>
                            <IconButton aria-label="edit" onClick={onEditClick}>
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                        <UserAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} reloadData={reloadData} roles={props.roles} clickedUser={params.row}/>

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
            <UserAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} reloadData={reloadData} roles={props.roles}/>

        </>
    );
}
