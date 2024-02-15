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
import DeleteClientDiscountsDialog
    from "@/Components/Dialogs/ClientDialog/ClientDeleteDialogs/DeleteClientDiscountsDialog";

export default function ClientDiscountsTable({discounts, readOnly, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);


    const {data, setData, re} = useForm([])

    useEffect(() => {
        setData(discounts)
    }, [discounts]);

    console.log(data)
    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "type",
            headerName: "Typ",
            sortable: false,
            filterable: false,
            width: 150,
            renderCell: (params) => {
                let text = '';
                switch (params.value) {
                    case 1:
                        text = 'Model';
                        break;
                    case 2:
                        text = 'Kategoria';
                        break;
                    case 3:
                        text = 'Grupa';
                        break;
                    case 4:
                        text = 'Producent';
                        break;
                }
                return (
                    <Box>
                        <Typography>{text}</Typography>
                    </Box>
                );
            },

        },
        {
            field: "name",
            headerName: "Nazwa",
            sortable: false,
            filterable: false,
            // align: 'center',
            width: 400,
            renderCell: (params) => {
                let text = '';
                switch (params.row.type) {
                    case 1:
                        text = params.row.product_model.symbol + " - " + params.row.product_model.name
                        break;
                    case 2:
                        text = params.row.product_category.name
                        break;
                    case 3:
                        text = params.row.product_group.name
                        break;
                    case 4:
                        text = params.row.product_brand.name
                        break;
                }
                return (
                    <Box>
                        <Typography>{text}</Typography>
                    </Box>
                );
            }
        },
        {
            field: "value",
            headerName: "Wartość rabatu", sortable: false,
            filterable: false,
            align: 'center',
            width: 100,
            renderCell: (params) => {
                return (
                    <Box>
                        <Typography>{params.row?.value}%</Typography>
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

                        <DeleteClientDiscountsDialog open={openDialogDelete} setOpen={setOpenDialogDelete}
                                                     discount={params.row}/>
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
                // rows={data}
                rows={sortByDateAndTimeObject(data)}
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
