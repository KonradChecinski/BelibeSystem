import {DataGrid, plPL} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {Box, Fab, IconButton, Tooltip, Typography} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import {useForm} from "@inertiajs/react";
import DeleteClientLocationsDialog
    from "@/Components/Dialogs/ClientDialog/ClientDeleteDialogs/DeleteClientLocationsDialog";
import ClientAddEditLocationsDialog
    from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditLocationsDialog";

export default function ClientLocationsTable({locations, readOnly, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);

    const {data, setData, re} = useForm([])

    useEffect(() => {
        setData(locations)
    }, [locations]);

    const column = [
        {field: "id", headerName: "Id"},
        {field: "name", headerName: "Nazwa", flex: 1, minWidth: 160},

        {
            field: "city",
            headerName: "Adres",
            width: 180,
            renderCell: (params) => {
                return (
                    <Box>
                        <Typography sx={{fontSize: "11px"}}>
                            {params.row?.street} {params.row?.building_number}{params.row?.apartment_number ? "/" + params.row?.apartment_number : ""}</Typography>
                        <Typography sx={{fontSize: "11px"}}>
                            {params.row?.city}, {params.row?.postal_code} - {params.row?.country?.name}
                        </Typography>
                        <Typography sx={{fontSize: "11px"}}>
                            {params.row?.phone}
                        </Typography>
                        <Typography sx={{fontSize: "11px"}}>
                            {params.row?.email}
                        </Typography>
                    </Box>
                );
            }
        },

        // {field: "city", headerName: "Miasto"},
        // {field: "street", headerName: "Ulica"},
        // {field: "building_number", headerName: "Numer budynku"},
        // {field: "apartment_number", headerName: "Numer lokalu"},
        // {field: "postal_code", headerName: "Kod pocztowy"},
        {field: "active", headerName: "Aktywność", type: "boolean", width: 50},
    ];


    const columnWithAction = [
        ...column,
        {
            field: "action",
            headerName: "Akcje",
            width: 80,
            sortable: false,
            renderCell: (params) => {
                const [openDialogDelete, setOpenDialogDelete] = useState(false);
                const [openDialogAdd, setOpenDialogAdd] = useState(false);


                const onEditClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    setOpenDialogAdd(true)
                };

                const onDeleteClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    setOpenDialogDelete(true);
                };
                return (
                    <>
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

                        <DeleteClientLocationsDialog open={openDialogDelete} setOpen={setOpenDialogDelete}
                                                     location={params.row} params={props}/>
                        <ClientAddEditLocationsDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                                      clickedLocation={params.row} params={props}/>
                    </>

                );

            }
        }
    ];
    const columnVisibility = {
        id: false,
    };
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        ...columnVisibility
    });
    const [rowCountState, setRowCountState] = useState(data.length);


    return (
        <>
            <DataGrid
                rows={data}
                columns={readOnly ? column : columnWithAction}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                }
                rowCount={rowCountState}
                pageSizeOptions={[5, 20, 50, 100]}
                editMode="row"
                // rowHeight={80}
                getRowHeight={() => 'auto'}
                // slots={{ toolbar: GridToolbar }}
                // slotProps={{
                //     toolbar: {
                //         showQuickFilter: true,
                //         quickFilterProps: {debounceMs: 500}
                //     }
                // }}
                disableColumnFilter
                // disableColumnSelector
                disableDensitySelector
                // disableColumnMenu
                disableVirtualization
                autoHeight
                localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
                sx={{

                    boxShadow: 2,
                    border: 2,
                    borderColor: "primary.main",
                    "& .MuiDataGrid-toolbarContainer": {
                        "& .MuiButton-root": {
                            color: "text.primary"
                        }
                    },
                    "& .MuiToolbar-gutters": {
                        display: "none"
                    },
                    "& .MuiDataGrid-selectedRowCount": {
                        display: "none"
                    },
                    "& .MuiDataGrid-row.Mui-selected": {
                        bgcolor: "rgba(255,255,255,0.25)"
                    },
                    "& .MuiDataGrid-row:hover": {
                        bgcolor: "primary"
                    }
                }}
            />
            {!readOnly ?
                <>
                    <Box sx={{position: "absolute", bottom: -10, right: 0, zIndex: 20}}>
                        <Fab color="primary" aria-label="add" onClick={() => setOpenDialogAdd(true)}>
                            <Add/>
                        </Fab>

                    </Box>

                    <ClientAddEditLocationsDialog open={openDialogAdd} setOpen={setOpenDialogAdd} clickedLocation={null}
                                                  params={props}/>
                </>
                : ""
            }

        </>
    );
}
