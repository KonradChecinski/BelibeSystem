import {useCallback, useMemo, useRef, useState} from "react";
import {
    Box, Button, debounce,
    IconButton, TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    Delete,
    Info
} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import 'cronstrue/locales/pl';
import {enqueueSnackbar} from "notistack";
import toLocaleString from "@/Functions/toLocaleString";
import {Link, router, useForm} from "@inertiajs/react";
import {keyframes} from "@emotion/css";
import SearchProductComponent from "@/Components/Table/Warehouse/WarehouseDocumentEditTable/SearchProductComponent";


export default function WarehouseDocumentEditTable({data, setData, props}) {
    console.log(data)
    // console.log(data.warehouse_document_products)
    const productsHistory = props.warehouseDocument.warehouse_document_products

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 10,
                enableEditing: false,
                Edit: () => null,
            },
            {
                accessorKey: 'product.symbol',
                header: 'Symbol',
                size: 300,

                enableResizing: true,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: true,
                Edit: ({cell, column, row, table}) => {

                    // console.log(table.getState(), table.getState().creatingRow, table.getState().editingRow)
                    // console.log(cell)
                    if (table.getState().creatingRow && cell.row.id === "mrt-row-create") {
                        return (
                            <SearchProductComponent
                                products={data.map((product) => {
                                    return product.product
                                })}
                                data={data}
                                setData={(item) => {
                                    setData([
                                            ...data,
                                            {
                                                currency: "PLN",
                                                id: "added_" + (Math.random() + 1).toString(36).substring(7),
                                                original_price_gross: item.prices.original_price_gross,
                                                original_price_net: item.prices.original_price_net,
                                                price_gross: item.prices.price_gross,
                                                price_net: item.prices.price_net,
                                                product: item,
                                                product_code: null,
                                                product_id: item.id,
                                                quantity: 1,
                                                type: 1,
                                                warehouse_document_id: props.warehouseDocument.id
                                            }
                                        ]
                                    )
                                    table.setCreatingRow(null);
                                    productsHistory.push({
                                        currency: "PLN",
                                        id: "added_" + (Math.random() + 1).toString(36).substring(7),
                                        original_price_gross: item.prices.original_price_gross,
                                        original_price_net: item.prices.original_price_net,
                                        price_gross: item.prices.price_gross,
                                        price_net: item.prices.price_net,
                                        product: item,
                                        product_code: null,
                                        product_id: item.id,
                                        quantity: 0,
                                        type: 1,
                                        warehouse_document_id: props.warehouseDocument.id
                                    })
                                    console.log(productsHistory)
                                }}
                                props={props}
                            />
                        );
                    }
                    return (<>{row.original.product ? cell.getValue() : row.original.product_code}</>);
                },
            },
            {
                accessorKey: 'product.size.name',
                header: 'Rozmiar',
                muiTableBodyCellProps: {
                    align: 'center',
                    sx: {
                        color: "disabled.background"
                    }
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                size: 80,
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: false,
                Edit: () => null,
            },
            {
                accessorKey: 'product.color.shortcut',
                header: 'Kolor',
                muiTableBodyCellProps: {
                    align: 'center',
                    sx: {
                        color: "disabled.background"
                    }
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                size: 80,
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: false,
                Edit: () => null,
            },
            {
                accessorKey: 'product.color.name',
                header: 'Nazwa koloru',
                muiTableBodyCellProps: {
                    sx: {
                        color: "disabled.background"
                    }
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                size: 180,
                enableResizing: true,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: false,
                Edit: () => null,
            },
            {
                accessorKey: 'quantity',
                header: 'Ilość',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                size: 120,
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: true,
                muiEditTextFieldProps: ({cell, row, column}) => ({
                    type: 'number',
                    required: true,
                    variant: 'outlined',
                    sx: {textAlign: "center"},
                    label: column.columnDef.header
                }),
                Edit: ({cell, column, row, table}) => {
                    // console.log(row.original.product.available, cell.getValue(), row.original.product.available + cell.getValue())
                    console.log()
                    if (cell.row.id !== "mrt-row-create") {
                        return (
                            <ProductInput
                                props={row.original}
                                quantity={cell.getValue()}
                                maxQuantity={Number(productsHistory.find((product) => product.id === row.original.id)?.quantity + Number(row.original.product?.available))}
                                setQuantity={(value) => {
                                    // console.log(data, value, row.original.id)
                                    // row._valuesCache[column.id] = value;
                                    setData(data.map((item) => {
                                        if (item.id === row.original.id) {
                                            return {...item, quantity: value}
                                        }
                                        return item;
                                    }));
                                }}
                            />
                        )
                    }
                    return (<>{cell.renderValue()}</>);
                }
            },


            {
                accessorKey: 'original_price_net',
                header: 'Cena Netto',
                size: 100,
                muiTableBodyCellProps: {
                    align: 'right',
                    sx: {
                        color: "disabled.background"
                    }
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => cell.getValue() && toLocaleString(Number(cell.getValue()) / 100),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: false,
                Edit: () => null,
            },
            {
                accessorKey: 'original_price_gross',
                header: 'Cena Brutto',
                size: 100,
                muiTableBodyCellProps: {
                    align: 'right',
                    sx: {
                        color: "disabled.background"
                    }
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => cell.getValue() && toLocaleString(Number(cell.getValue()) / 100),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: false,
                Edit: () => null,
            },
            {
                accessorKey: 'price_net',
                header: 'Cena Netto (R)',
                size: 120,
                muiTableBodyCellProps: {
                    align: 'right',
                    sx: {
                        color: "disabled.background"
                    }
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => cell.getValue() && toLocaleString(Number(cell.getValue()) / 100),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: false,
                Edit: () => null,
            },
            {
                accessorKey: 'price_gross',
                header: 'Cena Brutto (R)',
                size: 120,
                muiTableBodyCellProps: {
                    align: 'right',
                    sx: {
                        color: "disabled.background"
                    }
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({cell}) => cell.getValue() && toLocaleString(Number(cell.getValue()) / 100),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: false,
                Edit: () => null,
            },
            {
                accessorKey: 'total_net',
                header: 'Wartość Netto',
                size: 120,
                muiTableBodyCellProps: {
                    align: 'right',
                    sx: {
                        color: "disabled.background"
                    }
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({
                           cell,
                           row
                       }) => row.original.price_net && toLocaleString((Number(row.original.price_net) / 100) * row.original.quantity),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: false,
                Edit: () => null,
            },
            {
                accessorKey: 'total_gross',
                header: 'Wartość Brutto',
                size: 120,
                muiTableBodyCellProps: {
                    align: 'right',
                    sx: {
                        color: "disabled.background"
                    }
                },
                muiTableHeadCellProps: {
                    align: 'right',
                },
                Cell: ({
                           cell,
                           row
                       }) => row.original.price_gross && toLocaleString((Number(row.original.price_gross) / 100) * row.original.quantity),
                enableResizing: false,
                enableColumnActions: false,
                enableColumnDragging: false,
                enableSorting: false,
                enableEditing: false,
                Edit: () => null,
            },

        ],
        [],
        //end
    );

    const table = useMaterialReactTable({
        // data: data.warehouse_document_products,
        data: data,
        columns,
        enableTopToolbar: true,
        enableBottomToolbar: true,
        enableGrouping: true,
        enableStickyHeader: true,
        // enableStickyFooter: true,
        localization: MRT_Localization_PL,
        enableColumnResizing: true,
        enableRowNumbers: true,
        enablePagination: false,
        enableEditing: true,
        editDisplayMode: "table",
        createDisplayMode: "row",
        positionCreatingRow: 'bottom',
        enableRowActions: true,
        positionActionsColumn: 'last',
        onCreatingRowSave: ({table, values}) => {
            //validate data
            //save data to api
            table.setCreatingRow(null); //exit creating mode
        },
        onCreatingRowCancel: () => {
            //clear any validation errors
        },
        renderTopToolbarCustomActions: ({table}) => (
            <Button
                onClick={() => {
                    table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                    //or you can pass in a row object to set default values with the `createRow` helper function
                    // table.setCreatingRow(
                    //   createRow(table, {
                    //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                    //   }),
                    // );
                }}
            >
                Create New User
            </Button>
        ),
        renderRowActions: ({row}) => (
            <Box sx={{display: 'flex', gap: '1rem'}}>
                <Tooltip title="Delete">
                    <IconButton color="error">
                        {/*onClick={() => openDeleteConfirmModal(row)}*/}
                        <Delete/>
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        initialState: {
            columnVisibility: {
                id: false,

            },
            density: 'comfortable',
            // sorting: [
            //     {
            //         id: 'created_at',
            //         desc: true,
            //     },
            // ]
        },
        muiTableContainerProps: {
            sx: {
                height: "calc(100% - 110px)",
            },
        },
        // muiTableProps: {
        //     sx: {height: 1}
        // },
        muiTablePaperProps: ({table}) => ({
            sx: {
                pl: 1,
                // height: 1
                flex: 1,
            },
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
    });


    return (
        <>
            <MaterialReactTable table={table}/>
        </>

    );
}


const ProductInput = ({quantity, maxQuantity, setQuantity, props}) => {

    const inputRef = useRef(null);


    return (
        <Box>
            <TextField
                id="outlined-basic"
                label="Ilość"
                variant="outlined"
                type={"number"}
                defaultValue={quantity}
                // onChange={(event) => setQuantity(event.target.value)}
                error={quantity > maxQuantity}
                onBlur={(event) => setQuantity(event.target.value)}
                InputProps={{
                    inputProps: {
                        min: 0,
                        // max: maxQuantity,
                        style: {
                            textAlign: "center",
                            fontSize: 13
                        }
                    }
                }}
                sx={{
                    width: 1,
                    minWidth: "14ch",
                    maxWidth: "20ch",

                    "& .MuiFormLabel-root.Mui-error": {
                        color: "orange !important"
                    },
                    "& .MuiOutlinedInput-root.Mui-error>.MuiOutlinedInput-notchedOutline": {
                        borderColor: "orange !important"
                    },
                    "& .MuiFormHelperText-root.Mui-error": {
                        color: "orange !important"
                    }
                }}
                ref={inputRef}
            />
            <Box sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 0.5,
                mt: 1,

            }}>
                {/*<Typography variant="caption">*/}
                {/*    Dostępność:*/}
                {/*</Typography>*/}
                <Typography variant="body2">
                    Dostępne: {!isNaN(maxQuantity) && maxQuantity}
                </Typography>
            </Box>

        </Box>
    );
}
