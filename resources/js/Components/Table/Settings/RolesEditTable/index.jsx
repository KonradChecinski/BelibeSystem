import {DataGrid, GridToolbar, plPL, enUS, GridFooterContainer, GridFooter} from "@mui/x-data-grid";
import {useCallback, useEffect, useState} from "react";
import {
    Button,
    Checkbox, Fade, Typography
} from "@mui/material";
import {useForm} from "@inertiajs/react";
import {Save} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";

export default function RolesEditTable(props) {
    const [edited, setEdited] = useState(false);

    const [pageData, setPageData] = useState([]);
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
        id: true,
        name: false
    });

    const {data, setData, post, processing, errors, clearErrors, reset} = useForm({
        id: props.role.id,
        name: props.role.name,
        permissions: props.role.permissions,
    })
    const saveBasic = () => {
        post(route("system.settings.roles.edit", {settingsRole: data.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zmieniono uprawnienia", {variant: 'success'})
            },
            onError: params => {
                console.error(params);
                enqueueSnackbar("Błąd przy zmianie uprawnień", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    const column = [
        {field: "id", headerName: "Id"},
        {
            field: "name",
            headerName: "Nazwa systemowa",
            sortable: false,
            filterable: false,
            width: 200
        },
        {
            field: "name_human",
            headerName: "Nazwa",
            width: 400
        },
        {
            field: "group",
            headerName: "Grupa",
            flex: 1
        },

        {
            field: "permission",
            headerName: "Zgoda",
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const handleChange = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    if (data.permissions.filter((e) => e.id === params.row.id).length) {
                        setData("permissions", data.permissions.filter((e) => e.id !== params.row.id))
                    } else {
                        setData("permissions", [...data.permissions, {id: params.row.id}])
                    }
                    setEdited(true)

                };
                return (
                    <Checkbox
                        checked={data.permissions.find(e => e.id === params.row.id) ? true : false}
                        onChange={handleChange}
                        sx={{"& .MuiSvgIcon-root": {fontSize: 28}}}
                    />

                );

            }
        },
    ];
    const customFooter = () => {
        return (
            <GridFooterContainer>
                {/* Add what you want here */}
                <Fade in={edited}>
                    <Button variant="outlined" startIcon={<Save/>}
                            disabled={processing}
                            onClick={saveBasic}
                            sx={{
                                position: "absolute",
                                top: 7,
                                right: 230,
                            }}>
                        Zapisz
                    </Button>
                </Fade>

                <GridFooter sx={{
                    border: 'none', // To delete double border.
                    width: 1
                }}/>
            </GridFooterContainer>
        );
    }
    return (
        <>
            <DataGrid
                rows={props.permissions}
                columns={column}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) =>
                    setColumnVisibilityModel(newModel)
                }

                pageSizeOptions={[5, 20, 50, 100]}
                slots={{toolbar: GridToolbar, footer: customFooter}}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: {debounceMs: 500}
                    }
                }}
                // disableColumnFilter
                //disableColumnSelector
                disableDensitySelector
                // autoHeight
                rowHeight={50}
                pagination
                localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
                sx={{
                    height: "100%",
                    boxShadow: 2,
                    border: 2,
                    borderColor: "primary.light",
                    position: "relative",
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


        </>
    );
}

