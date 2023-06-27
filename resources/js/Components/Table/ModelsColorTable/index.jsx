import { DataGrid, GridToolbar, plPL, enUS } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, IconButton } from "@mui/material";
import { Add, Delete, Edit, Preview, Visibility } from "@mui/icons-material";

export default function ModelsColorTable({ data }) {
    const column = [
        { field: "id", headerName: "Id" },
        { field: "subiekt_id", headerName: "Id Subiekt" },
        {
            field: "symbol",
            headerName: "Symbol",
            sortable: false,
            filterable: false,
            width: 200
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
            filterable: false
        },
        {
            field: "quantity",
            headerName: "Stan",
            sortable: false,
            filterable: false
        },
        {
            field: "show_in_subiekt",
            headerName: "Subiekt",
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const handleChange = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    return alert(JSON.stringify(params.row, null, 4));
                };

                return (
                    <Checkbox
                        checked={params.row.show_in_b2b == 1 ? true : false}
                        onChange={handleChange}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    />

                );

            }
        },
        {
            field: "show_in_b2b",
            headerName: "B2B",
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const handleChange = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    return alert(JSON.stringify(params.row, null, 4));
                };

                return (
                    <Checkbox
                        checked={params.row.show_in_b2b == 1 ? true : false}
                        onChange={handleChange}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    />

                );

            }
        },
        {
            field: "show_in_b2c",
            headerName: "B2C",
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const handleChange = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    return alert(JSON.stringify(params.row, null, 4));
                };

                return (
                    <Checkbox
                        checked={params.row.show_in_b2c == 1 ? true : false}
                        onChange={handleChange}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    />

                );

            }
        },
        {
            field: "show_in_allegro",
            headerName: "Allegro",
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const handleChange = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    return alert(JSON.stringify(params.row, null, 4));
                };

                return (
                    <Checkbox
                        checked={params.row.show_in_allegro == 1 ? true : false}
                        onChange={handleChange}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    />

                );

            }
        },

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
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    return alert(JSON.stringify(params.row, null, 4));
                };

                return (
                    <>

                        <IconButton aria-label="preview">
                            {/*<Preview />*/}
                            <Visibility />
                        </IconButton>
                        <IconButton aria-label="edit" onClick={onClick}>
                            <Edit />
                        </IconButton>
                        <IconButton aria-label="delete">
                            <Delete />
                        </IconButton>

                    </>

                );

            }
        }
    ];


    return (
        <DataGrid
            rows={data}
            columns={columnWithAction}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
                setColumnVisibilityModel(newModel)
            }
            rowCount={rowCountState}
            pageSizeOptions={[5, 20, 50, 100]}


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
            // pagination
            localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
            sx={{
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
    );
}
