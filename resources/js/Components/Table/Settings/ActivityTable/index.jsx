import {DataGrid, GridToolbar, plPL} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {
    Box,
    Fab,
    IconButton, Tooltip,
} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import DictionariesDeleteDialog from "@/Components/Dialogs/DictionariesDialog/DictionariesDeleteDialog";
import DictionariesAddDialog from "@/Components/Dialogs/DictionariesDialog/DictionariesAddDialog";

export default function ActivityTable(props) {
    const data = props.activityTypes;

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

                        <DictionariesDeleteDialog open={openDialogDelete}
                                                  setOpen={setOpenDialogDelete}
                                                  clickedRow={params.row}
                                                  dictionaryType={"activity"}
                                                  label={"Usuwanie typu aktywności"}/>

                        <DictionariesAddDialog open={openDialogEdit}
                                               setOpen={setOpenDialogEdit}
                                               dictionaryType={"activity"}
                                               clickedRow={params.row}
                                               routeParam={{b2bActivityType: params.row.id}}
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

            <DictionariesAddDialog open={openDialogAdd}
                                   setOpen={setOpenDialogAdd}
                                   dictionaryType={"activity"}
            />
        </>
    );
}

