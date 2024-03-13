import {DataGrid, GridToolbar, plPL, enUS} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {Box, Button, Checkbox, Fab, IconButton, Tooltip, Typography, Zoom} from "@mui/material";
import {Add, ContentCopy, CopyAll, Delete, Edit, Preview, Save, Visibility} from "@mui/icons-material";
import ColorsCell from "@/Components/Table/Model/ModelsTable/ColorsCell";
import CodesCell from "@/Components/Table/Model/ModelsColorTable/BarcodesCell";
import BarcodesCell from "@/Components/Table/Model/ModelsColorTable/BarcodesCell";
import {useTheme} from "@mui/material/styles";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import ProductsDeleteDialog from "@/Components/Dialogs/ProductsDialog/ProductsDeleteDialog";
import {sortBySizesModelColorObject} from "@/Functions/sortBySizes";
import ProductsAddDialog from "@/Components/Dialogs/ProductsDialog/ProductsAddDialog";
import {sortByDateAndTimeObject} from "@/Functions/sortByDateAndTime";
import DeleteClientTaskDialog from "@/Components/Dialogs/ClientDialog/ClientDeleteDialogs/DeleteClientTaskDialog";
import ClientAddEditTasksDialog from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditTasksDialog";
import moment from "moment/moment";

export default function ClientTasksTable({tasks, readOnly, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);


    const {data, setData, re} = useForm([])

    useEffect(() => {
        setData(tasks)
    }, [tasks]);


    const column = [
        {field: "id", headerName: "Id"},
        {field: "title", headerName: "Tytuł", width: 200},
        {field: "text", headerName: "Treść", flex: 1},
        {
            field: "user_id",
            headerName: "Użytkownik",
            renderCell: (params) => {
                return (
                    <Box>
                        <Typography>{params.row?.user?.name}</Typography>
                    </Box>
                );
            }
        },
        {
            field: "datetime", headerName: "Data i godzina", width: 150,
            renderCell: (params) => {
                let date = moment(params.value)
                return (
                    <Box>
                        <Typography>{date.format("YYYY-MM-DD HH:mm")}</Typography>
                    </Box>
                );
            }
        },
    ];


    const columnWithAction = [
        ...column,
        {
            field: "action",
            headerName: "Akcje",
            width: 120,
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

                        <DeleteClientTaskDialog open={openDialogDelete} setOpen={setOpenDialogDelete}
                                                task={params.row} params={props}/>

                        <ClientAddEditTasksDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                                  clickedTask={params.row} params={props}/>
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
                // rows={sortByDateAndTimeObject(data)}
                columns={readOnly ? column : columnWithAction}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                }
                rowCount={rowCountState}
                pageSizeOptions={[5, 20, 50, 100]}
                editMode="row"

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

                    <ClientAddEditTasksDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                              clickedTask={null} params={props}/>
                </>
                : ""
            }

        </>
    );
}
