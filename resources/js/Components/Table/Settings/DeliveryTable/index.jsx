import {DataGrid, GridToolbar, plPL} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {
    Box,
    Fab,
    IconButton, Switch, Tooltip,
} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import DictionariesDeleteDialog from "@/Components/Dialogs/DictionariesDialog/DictionariesDeleteDialog";
import DeliveryAddDialog from "@/Components/Dialogs/DeliveryDialog/DeliveryAddDialog";
import toLocaleString from "@/Functions/toLocaleString";
import {router} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";

export default function DeliveryTable(props) {
    const data = props.deliveries

    const column = [
        {field: "id", headerName: "Id"},

        {
            field: "name",
            headerName: "Nazwa",
            flex: 1
        },
        {
            field: "description",
            headerName: "Opis",
            width: 350
        },
        {
            field: "subiekt_id",
            headerName: "Id w Subiekcie",
            width: 150
        },
        {
            field: "price_net",
            headerName: "Cena Netto",
            valueGetter: (params) => toLocaleString(params.value / 100),
            width: 150
        },
        {
            field: "price_gross",
            headerName: "Cena Brutto",
            valueGetter: (params) => toLocaleString(params.value / 100),
            width: 150
        },
        {
            field: "free_from",
            headerName: "Darmowa wysyłka od",
            valueGetter: (params) => toLocaleString(params.value / 100),
            width: 150
        },
        {
            field: "delivery_time_min",
            headerName: "Min. czas dostawy",
            width: 150
        },
        {
            field: "delivery_time_max",
            headerName: "Max. czas dostawy",
            width: 150
        },

        {
            field: "active",
            headerName: "Aktywność",
            width: 150,
            renderCell: (params) => {
                return (
                    <Switch
                        checked={Boolean(params.value)}
                        disabled={true}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                );
            }

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

                        <DictionariesDeleteDialog open={openDialogDelete}
                                                  setOpen={setOpenDialogDelete}
                                                  clickedRow={params.row}
                                                  dictionaryType={"delivery"}
                                                  label={"Usuwanie dostawy"}/>

                        <DeliveryAddDialog open={openDialogEdit}
                                           setOpen={setOpenDialogEdit}
                                           clickedDelivery={params.row}
                        />
                    </>
                );
            }
        }
    ];
    const columnVisibility = {
        id: false
    };


    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        ...columnVisibility
    });


    const [openDialogAdd, setOpenDialogAdd] = useState(false);

    return (
        <>
            <DataGrid
                rows={data}
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

            <DeliveryAddDialog open={openDialogAdd}
                               setOpen={setOpenDialogAdd}
            />
        </>
    );
}

