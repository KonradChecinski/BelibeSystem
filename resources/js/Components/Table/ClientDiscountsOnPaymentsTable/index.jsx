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
import ClientAddEditPaymentsDiscountsDialog
    from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditPaymentsDiscountsDialog";

export default function ClientDiscountsOnPaymentsTable({payments, readOnly, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);

    const {data, setData, re} = useForm(payments.slice().sort((a, b) => (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0))

    useEffect(() => {
        setData(payments.slice().sort((a, b) => (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0))
    }, [payments]);

    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "name",
            headerName: "Nazwa",
            sortable: false,
            filterable: false,
            flex: 1,
        },
        {
            field: "discount.discount",
            headerName: "Aktywność",
            sortable: false,
            filterable: false,
            type: "boolean",
            align: 'center',
            width: 100,
            valueGetter: (params) => params.row?.discount?.discount
        },
        {
            field: "discount.discount_value",
            headerName: "Wartość",
            sortable: false,
            filterable: false,
            align: 'center',
            headerAlign: 'center',
            width: 100,
            valueGetter: (params) => params.row?.discount?.discount_value + "%"
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

                return (
                    <>
                        <Tooltip title="Edycja">
                            <IconButton aria-label="edit" onClick={onEditClick}>
                                <Edit/>
                            </IconButton>
                        </Tooltip>

                        <ClientAddEditPaymentsDiscountsDialog open={openDialogAdd} setOpen={setOpenDialogAdd}
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

        </>
    );
}
