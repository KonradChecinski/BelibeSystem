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
import ClientAddEditDiscountsDialog
    from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditDiscountsDialog";

export default function ClientDiscountsTable({discounts, readOnly, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);


    const {data, setData, re} = useForm(discounts)
    const [rowCountState, setRowCountState] = useState(discounts.length);

    useEffect(() => {
        setData(discounts)
        setRowCountState(discounts.length)
    }, [discounts]);

    const getName = (row) => {
        let text = '';
        switch (row.type) {
            case 1:
                text = row.product_model.symbol + " - " + row.product_model.name
                break;
            case 2:
                text = row.product_category.name
                break;
            case 3:
                text = row.product_group.name
                break;
            case 4:
                text = row.product_brand.name
                break;
        }

        return text;
    }

    const getType = (params) => {
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

        return text;
    }

    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "type",
            headerName: "Typ",
            sortable: true,
            filterable: true,
            width: 150,
            valueGetter: (params) => getType(params),
        },
        {
            field: "name",
            headerName: "Nazwa",
            sortable: true,
            filterable: true,
            // align: 'center',
            flex: 1,
            valueGetter: (params) => getName(params.row),
        },
        {
            field: "value",
            headerName: "Wartość rabatu",
            sortable: true,
            filterable: true,
            align: 'center',
            width: 100,
            valueGetter: (params) => params.row?.value + "%",
        },
    ];


    const columnWithAction = [
        ...column,
        {
            field: "action",
            headerName: "Akcje",
            width: 120,
            sortable: false,
            filterable: false,
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
                                                     discount={params.row} params={props}/>
                        <ClientAddEditDiscountsDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                                      clickedDiscount={params.row} params={props}/>
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
                pageSizeOptions={[5, 10, 20, 50, 100]}
                // editMode="row"
                slots={{toolbar: GridToolbar}}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        printOptions: {disableToolbarButton: true},
                        csvOptions: {disableToolbarButton: true},
                        quickFilterProps: {debounceMs: 500}
                    }
                }}
                initialState={{
                    ...data.initialState,
                    pagination: {paginationModel: {pageSize: 10}},
                    sorting: {
                        sortModel: [{field: 'type', sort: 'asc'}],
                    },
                }}
                // disableColumnFilter
                disableColumnSelector
                // disableDensitySelector
                // disableColumnMenu
                // disableVirtualization
                autoHeight
                pagination
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
            {!readOnly ?
                <>
                    <Box sx={{position: "absolute", bottom: -25, right: -15, zIndex: 20}}>
                        <Fab color="primary" aria-label="add" onClick={() => setOpenDialogAdd(true)}>
                            <Add/>
                        </Fab>

                    </Box>

                    <ClientAddEditDiscountsDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
                                                  clickedDiscount={null} params={props}/>
                </>
                : ""
            }

        </>
    );
}
