import {DataGrid, plPL} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {Box, Fab, IconButton, Tooltip, Typography} from "@mui/material";
import {Add, ContentCopy, Delete, Edit} from "@mui/icons-material";
import BarcodesCell from "@/Components/Table/Model/ModelsColorTable/BarcodesCell";
import ShowChannelsCell from "@/Components/Table/Model/ModelsColorTable/ShowChannelsCell";
import {useForm} from "@inertiajs/react";
import ProductsDeleteDialog from "@/Components/Dialogs/ProductsDialog/ProductsDeleteDialog";
import {sortBySizesModelColorObject} from "@/Functions/sortBySizes";
import ProductsAddDialog from "@/Components/Dialogs/ProductsDialog/ProductsAddDialog";

export default function ModelsColorTable({products, readOnly, units, color, props}) {
    const [openDialogAdd, setOpenDialogAdd] = useState(false);

    const {data, setData} = useForm(products);

    useEffect(() => {
        setData(products);
    }, [products]);

    const column = [
        {field: "id", headerName: "Id"},
        {field: "subiekt_id", headerName: "Id Subiekt"},
        {
            field: "symbol",
            headerName: "Symbol",
            sortable: false,
            filterable: false,
            width: 160,
        },
        {
            field: "name",
            headerName: "Nazwa",
            sortable: false,
            filterable: false,
            width: 300,
        },
        {
            field: "name_b2c",
            headerName: "Nazwa B2C",
            sortable: false,
            filterable: false,
            width: 300,
        },
        {
            field: "size",
            headerName: "Rozmiar",
            sortable: false,
            filterable: false,
            width: 75,
            renderCell: (params) => {
                return <Typography>{params.row.size.name} </Typography>;
            },
        },
        {
            field: "quantity",
            headerName: "Stan",
            sortable: false,
            filterable: false,
            type: "number",
            width: 70,
        },
        {
            field: "available",
            headerName: "Dostępne",
            sortable: false,
            filterable: false,
            type: "number",
            width: 75,
        },
        {
            field: "unit",
            headerName: "J.m.",
            sortable: false,
            filterable: false,
            width: 70,
            renderCell: (params) => {
                return <Typography>{units.find((unit) => unit.id === params.row.product_unit_id)?.name} </Typography>;
            },
        },
        {
            field: "weight",
            headerName: "Waga (g)",
            sortable: false,
            filterable: false,
            type: "number",
            width: 90,
            renderCell: (params) => {
                return <Typography>{params.row.weight ?? 200} g</Typography>;
            },
        },
        {
            field: "codes",
            headerName: "Kody kreskowe",
            sortable: false,
            filterable: false,
            headerAlign: "center",
            align: "center",
            width: 150,
            renderCell: (params) => {
                return <BarcodesCell barcodes={params.row.barcodes}/>;
            },
        },
        {
            field: "channels",
            headerName: "Kanały sprzedaży",
            sortable: false,
            filterable: false,
            headerAlign: "center",
            align: "center",
            width: 235,
            renderCell: (params) => {
                return (
                    <ShowChannelsCell
                        row={params.row}
                        color={color}
                        props={props}
                        readOnly={readOnly}
                    />
                );
            },
        },
    ];

    const [rowCountState] = useState(0);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        id: false,
        subiekt_id: false,
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
                    e.stopPropagation();
                    setOpenDialogAdd(true);
                };

                const onCopyClick = (e) => {
                    e.stopPropagation();
                    setOpenDialogCopy(true);
                };

                const onDeleteClick = (e) => {
                    e.stopPropagation();
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
                        <ProductsDeleteDialog
                            open={openDialogDelete}
                            setOpen={setOpenDialogDelete}
                            product={params.row}
                            last={products.length === 1}
                        />
                        <ProductsAddDialog
                            open={openDialogAdd}
                            setOpen={setOpenDialogAdd}
                            color={color}
                            method={"update"}
                            actualState={params.row}
                            props={props}
                        />

                        <ProductsAddDialog
                            open={openDialogCopy}
                            setOpen={setOpenDialogCopy}
                            color={color}
                            method={"copy"}
                            actualState={params.row}
                            props={props}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <>
            <DataGrid
                rows={sortBySizesModelColorObject(data)}
                columns={readOnly ? column : columnWithAction}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                rowCount={rowCountState}
                pageSizeOptions={[5, 20, 50, 100]}
                editMode="row"
                disableColumnFilter
                disableDensitySelector
                disableVirtualization
                autoHeight
                localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
                sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: "primary.main",
                    "& .MuiDataGrid-toolbarContainer": {
                        "& .MuiButton-root": {
                            color: "text.primary",
                        },
                    },
                    "& .MuiToolbar-gutters": {
                        display: "none",
                    },
                    "& .MuiDataGrid-selectedRowCount": {
                        display: "none",
                    },
                    "& .MuiDataGrid-row.Mui-selected": {
                        bgcolor: "rgba(255,255,255,0.25)",
                    },
                    "& .MuiDataGrid-row:hover": {
                        bgcolor: "primary",
                    },
                }}
            />
            {!readOnly ? (
                <>
                    <Box sx={{position: "absolute", bottom: -10, right: -10, zIndex: 20}}>
                        <Fab color="primary" aria-label="add" onClick={() => setOpenDialogAdd(true)}>
                            <Add/>
                        </Fab>
                    </Box>

                    <ProductsAddDialog
                        open={openDialogAdd}
                        setOpen={setOpenDialogAdd}
                        color={color}
                        method={"create"}
                        props={props}
                    />
                </>
            ) : (
                ""
            )}
        </>
    );
}
