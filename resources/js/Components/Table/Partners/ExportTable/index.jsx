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


export default function ExportTable({exports, readOnly, props}) {
    const theme = useTheme();
    const data = exports;


    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 10,
            },
            {
                accessorKey: 'type',
                header: 'Type',
                size: 50,
            },
            {
                accessorKey: 'Ostatnia aktualizacja',
                header: 'Nazwa',
            },
            {
                accessorKey: 'action',
                header: 'Akcje',
                columnDefType: 'display',
                muiTableBodyCellProps: {
                    align: 'center',
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                Cell: ({cell, row}) => {
                    return (
                        <Box>
                            {props.auth.permissions.includes("editClient") ?
                                <Link href={route("system.clients.client.edit", {id: row.original.client.id})}>
                                    <Button>Edytuj</Button>
                                </Link>
                                :
                                props.auth.permissions.includes("showClient") ?
                                    <Link href={route("system.clients.client", {id: row.original.client.id})}>
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
        // enableStickyFooter: true,
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
            // sx: {maxHeight: 350, height: 1, minHeight: 200}
        },
        // muiTableProps: {
        //     sx: {height: 1}
        // },
        muiTablePaperProps: ({table}) => ({
            sx: {
                pl: 1,
                height: 1
            },
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
    });


    return (
        <MaterialReactTable table={table}/>

    );
}
