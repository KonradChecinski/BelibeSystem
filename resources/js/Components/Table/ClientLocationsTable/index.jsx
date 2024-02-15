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

export default function ClientLocationsTable({locations, readOnly, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);


    const {data, setData, re} = useForm([])

    useEffect(() => {
        setData(locations)
    }, [locations]);
    
    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "country_id",
            headerName: "Kraj",
            renderCell: (params) => {
                return (
                    <Box>
                        <Typography>{params.row?.country?.name}</Typography>
                    </Box>
                );
            }
        },

        {field: "city", headerName: "Miasto"},
        {field: "street", headerName: "Ulica"},
        {field: "building_number", headerName: "Numer budynku"},
        {field: "apartment_number", headerName: "Numer lokalu"},
        {field: "postal_code", headerName: "Kod pocztowy"},
        {field: "note", headerName: "Notatka", flex: 1},
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

                        {/*<ProductsDeleteDialog open={openDialogDelete} setOpen={setOpenDialogDelete}*/}
                        {/*                      product={params.row} last={products.length === 1}/>*/}
                        {/*<ProductsAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} color={color}*/}
                        {/*                   method={"update"} actualState={params.row} props={props}/>*/}
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

                    {/*<ProductsAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} color={color} method={"create"}*/}
                    {/*                   props={props}/>*/}
                </>
                : ""
            }

        </>
    );
}
