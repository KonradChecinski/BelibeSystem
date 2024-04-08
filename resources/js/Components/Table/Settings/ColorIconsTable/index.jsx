import {useMemo} from "react";
import {Box, Button, Tooltip, Typography,} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {Done, Close, DownloadDone} from '@mui/icons-material';
import moment from "moment";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import toLocaleString from "@/Functions/toLocaleString";
import {Link} from "@inertiajs/react";


export default function ColorIconsTable({colors, readOnly, props}) {
    const theme = useTheme();
    const data = colors;


    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 10,
            },
            {
                accessorKey: 'model.symbol',
                header: 'Symbol modelu',
                size: 50,
            },
            {
                accessorKey: 'shortcut',
                header: 'Symbol koloru',
                size: 50,
            },
            {
                accessorKey: 'name',
                header: 'Nazwa',
            },
            {
                accessorKey: 'action',
                header: 'Akcje',
                columnDefType: 'display',
                Cell: ({cell, row}) => {
                    return (
                        <Box>
                            {props.auth.permissions.includes("editModel") ?
                                <Link href={route("system.products.model.edit", {id: row.original.product_model_id})}>
                                    <Button>Edytuj</Button>
                                </Link>
                                :
                                props.auth.permissions.includes("showModel") ?
                                    <Link href={route("system.products.model", {id: row.original.product_model_id})}>
                                        <Button>Pokaż</Button>
                                    </Link>
                                    : ""
                            }
                        </Box>
                    )

                },
                size: 10,
            },
        ],
        [],
        //end
    );

    const table = useMaterialReactTable({
        data,
        columns,
        enableTopToolbar: true,
        enableBottomToolbar: true,
        enableGrouping: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        localization: MRT_Localization_PL,
        initialState: {
            columnVisibility: {id: false},
            density: 'compact',
            pagination: {pageSize: 50, pageIndex: 0},
            // sorting: [
            //     {
            //         id: 'nzf_Data',
            //         desc: true,
            //     },
            // ]
        },
        muiTableContainerProps: {
            sx: {maxHeight: '250px'}
        },
        muiTablePaperProps: ({table}) => ({
            sx: {
                pl: 1
            },
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
        // muiTableBodyRowProps: ({row}) => {
        //     // console.log(row.original, row.original.Rozliczenie, row.original.Wartosc, row.original.DniSpoznienia)
        //     return ({
        //         sx: {
        //             bgcolor: row.original.Rozliczenie != 2 ? row.original.DniSpoznienia != null ? Number(row.original.Wartosc) > 0 ? "errorBg.main" : "" : "" : ""
        //         },
        //     })
        // },
    });


    return (
        <MaterialReactTable table={table}/>

    );
}
