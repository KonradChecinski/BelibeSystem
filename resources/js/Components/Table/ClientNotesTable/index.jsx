import {DataGrid, GridToolbar, plPL, enUS} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {Box, Button, Checkbox, Fab, IconButton, Tooltip, Typography, Zoom} from "@mui/material";
import {Add, ContentCopy, CopyAll, Delete, Edit, Preview, Save, Visibility} from "@mui/icons-material";
import ColorsCell from "@/Components/Table/ModelsTable/ColorsCell";
import CodesCell from "@/Components/Table/ModelsColorTable/BarcodesCell";
import BarcodesCell from "@/Components/Table/ModelsColorTable/BarcodesCell";
import {useTheme} from "@mui/material/styles";
import {router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import ProductsDeleteDialog from "@/Components/Dialogs/ProductsDialog/ProductsDeleteDialog";
import {sortBySizesModelColorObject} from "@/Functions/sortBySizes";
import ProductsAddDialog from "@/Components/Dialogs/ProductsDialog/ProductsAddDialog";
import {sortByDateAndTimeObject} from "@/Functions/sortByDateAndTime";
import moment from "moment";
import DeleteClientNotesDialog from "@/Components/Dialogs/ClientDialog/ClientDeleteDialogs/DeleteClientNotesDialog";
import ClientAddEditNotesDialog from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditNotesDialog";

export default function ClientNotesTable({notes, readOnly, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);


    const {data, setData, re} = useForm([])

    useEffect(() => {
        setData(notes)
    }, [notes]);

    console.log(notes)
    const column = [
        {field: "id", headerName: "Id"},
        {field: "text", headerName: "Treść", flex: 1},
        {
            field: "user_id",
            headerName: "Dodana przez",
            renderCell: (params) => {
                return (
                    <Box>
                        <Typography>{params.row?.user?.name}</Typography>
                    </Box>
                );
            }
        },
        {
            field: "created_at", headerName: "Kiedy", width: 200,
            renderCell: (params) => {
                let date = moment(params.value)
                return (
                    <Box>
                        <Typography>{date.format("YYYY-MM-DD H:m:s")}</Typography>
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

                        <DeleteClientNotesDialog open={openDialogDelete} setOpen={setOpenDialogDelete}
                                                 note={params.row}/>

                        <ClientAddEditNotesDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                                  clickedNote={params.row} params={props}/>
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

                    <ClientAddEditNotesDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                              clickedNote={null} params={props}/>
                </>
                : ""
            }

        </>
    );
}
