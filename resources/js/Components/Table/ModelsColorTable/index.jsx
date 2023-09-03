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

export default function ModelsColorTable({products, readOnly, units, color, props}) {
    const theme = useTheme();
    const [openDialogAdd, setOpenDialogAdd] = useState(false);


    // const {data, setData, post, processing, errors, clearErrors, reset} = useForm(products)
    //
    // console.log(products)
    // console.log(data)


    const column = [
        {field: "id", headerName: "Id"},
        {field: "subiekt_id", headerName: "Id Subiekt"},
        {
            field: "symbol",
            headerName: "Symbol",
            sortable: false,
            filterable: false,
            width: 160
        },
        {
            field: "name",
            headerName: "Nazwa", sortable: false,
            filterable: false,
            width: 300
        },
        {
            field: "size",
            headerName: "Rozmiar",
            sortable: false,
            filterable: false,

            width: 70,
            renderCell: (params) => {
                return <Typography>{params.row.size.name} </Typography>;
            }
        },
        {
            field: "quantity",
            headerName: "Stan",
            sortable: false,
            filterable: false,
            type: "number",
            width: 70
        },
        {
            field: "unit",
            headerName: "J.m.",
            sortable: false,
            filterable: false,

            width: 70,
            renderCell: (params) => {
                return <Typography>{units.find(unit => unit.id === params.row.product_unit_id).name} </Typography>;
            }
        },
        {
            field: "codes",
            headerName: "Kody kreskowe",
            sortable: false,
            filterable: false,

            headerAlign: 'center',
            align: 'center',
            width: 150,
            renderCell: (params) => {
                return <BarcodesCell barcodes={params.row.barcodes}/>;

            }
        },
        {
            field: "show_in_subiekt",
            headerName: "Subiekt",
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const {data: rowData, setData: setRowData, reset} = useForm({
                    id: params.row.id,
                    show_in_subiekt: Boolean(params.row.show_in_subiekt)
                })
                const handleChange = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    setRowData("show_in_subiekt", !rowData.show_in_subiekt);

                    router.post(route("system.products.show.update", {product: rowData.id}),
                        {...rowData, show_in_subiekt: !rowData.show_in_subiekt},
                        {
                            onSuccess: params => {
                                // setEdited(false);
                                enqueueSnackbar("Zapisano", {variant: 'success'})

                            },
                            onError: params => {
                                enqueueSnackbar("Błąd przy zapisie", {variant: 'error'})
                            },
                            preserveScroll: true
                        })
                };

                return (
                    <Checkbox
                        disabled={readOnly}
                        checked={rowData.show_in_subiekt}
                        onChange={handleChange}
                        sx={{"& .MuiSvgIcon-root": {fontSize: 28}}}
                    />

                );

            }
        },
        {
            field: "show_in_b2b",
            headerName: "B2B",
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const {data: rowData, setData: setRowData, reset} = useForm({
                    id: params.row.id,
                    show_in_b2b: Boolean(params.row.show_in_b2b)
                })
                const handleChange = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    setRowData("show_in_b2b", !rowData.show_in_b2b);

                    router.post(route("system.products.show.update", {product: rowData.id}),
                        {...rowData, show_in_b2b: !rowData.show_in_b2b},
                        {
                            onSuccess: params => {
                                // setEdited(false);
                                enqueueSnackbar("Zapisano", {variant: 'success'})

                            },
                            onError: params => {
                                enqueueSnackbar("Błąd przy zapisie", {variant: 'error'})
                            },
                            preserveScroll: true
                        })
                };

                return (
                    <Checkbox
                        disabled={readOnly}
                        checked={rowData.show_in_b2b}
                        onChange={handleChange}
                        sx={{"& .MuiSvgIcon-root": {fontSize: 28}}}
                    />

                );

            }
        },
        {
            field: "show_in_b2c",
            headerName: "B2C",
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const {data: rowData, setData: setRowData, reset} = useForm({
                    id: params.row.id,
                    show_in_b2c: Boolean(params.row.show_in_b2c)
                })
                const handleChange = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    setRowData("show_in_b2c", !rowData.show_in_b2c);

                    router.post(route("system.products.show.update", {product: rowData.id}),
                        {...rowData, show_in_b2c: !rowData.show_in_b2c},
                        {
                            onSuccess: params => {
                                // setEdited(false);
                                enqueueSnackbar("Zapisano", {variant: 'success'})

                            },
                            onError: params => {
                                enqueueSnackbar("Błąd przy zapisie", {variant: 'error'})
                            },
                            preserveScroll: true
                        })
                };
                return (
                    <Checkbox
                        disabled={readOnly}
                        checked={rowData.show_in_b2c}
                        onChange={handleChange}
                        sx={{"& .MuiSvgIcon-root": {fontSize: 28}}}
                    />

                );

            }
        },
        // {
        //     field: "show_in_allegro",
        //     headerName: "Allegro",
        //     sortable: false,
        //     filterable: false,
        //     headerAlign: 'center',
        //     align: 'center',
        //     renderCell: (params) => {
        //         const handleChange = (e) => {
        //             e.stopPropagation(); // don't select this row after clicking
        //
        //             params.row.show_in_allegro = !params.row.show_in_allegro;
        //         };
        //
        //         return (
        //             <Checkbox
        //                 disabled={readOnly}
        //                 checked={params.row.show_in_allegro == 1 ? true : false}
        //                 onChange={handleChange}
        //                 sx={{"& .MuiSvgIcon-root": {fontSize: 28}}}
        //             />
        //
        //         );
        //
        //     }
        // }

    ];

    const [rowCountState, setRowCountState] = useState(0);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        id: false,
        subiekt_id: false
    });

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
                const [openDialogCopy, setOpenDialogCopy] = useState(false);


                const onEditClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    // return alert(JSON.stringify(params.row, null, 4));
                    // let row = {...data.find(e => e.id === params.row.id)}
                    // row.edit = true
                    // console.log('row', row)
                    // setData([...data.filter(e => e.id !== params.row.id), row])
                    setOpenDialogAdd(true)
                };

                const onCopyClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    setOpenDialogCopy(true)
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


                        <Tooltip title="Powiel">
                            <IconButton aria-label="copy" onClick={onCopyClick}>
                                <ContentCopy/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Usuń">
                            <IconButton aria-label="delete" onClick={onDeleteClick}>
                                <Delete/>
                            </IconButton>
                        </Tooltip>
                        <ProductsDeleteDialog open={openDialogDelete} setOpen={setOpenDialogDelete}
                                              product={params.row} last={products.length === 1}/>
                        <ProductsAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} color={color}
                                           method={"update"} actualState={params.row} props={props}/>

                        <ProductsAddDialog open={openDialogCopy} setOpen={setOpenDialogCopy} color={color}
                                           method={"copy"} actualState={params.row} props={props}/>
                        {/*reloadData={reloadData}*/}
                    </>

                );

            }
        }
    ];


    return (
        <>
            <DataGrid
                // rows={data}
                rows={sortBySizesModelColorObject(products)}
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
                //         quickFilterProps: { debounceMs: 500 }
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
            <Box sx={{position: "absolute", bottom: -10, right: -10, zIndex: 20}}>
                <Fab color="primary" aria-label="add" onClick={() => setOpenDialogAdd(true)}>
                    <Add/>
                </Fab>

            </Box>
            <ProductsAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} color={color} method={"create"}
                               props={props}/>
        </>
    );
}
