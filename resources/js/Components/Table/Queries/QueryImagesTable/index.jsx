import {useMemo} from "react";
import {Box, Button, Checkbox, Tooltip, Typography,} from "@mui/material";
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


export default function QueryImagesTable({images, readOnly, props}) {
    const theme = useTheme();
    const data = images;


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
                header: 'Model',
                size: 20,
            },
            {
                accessorKey: 'color.shortcut',
                header: 'Kolor',
                size: 20,
            },
            {
                accessorKey: 'color.name',
                header: 'Kolor - nazwa',
                size: 20,
            },
            {
                accessorKey: 'width',
                header: 'Szerokość',
                size: 20,
                filterFn: 'lessThan',
            },
            {
                accessorKey: 'height',
                header: 'Wysokość',
                size: 20,
                filterFn: 'lessThan',
            },

            {
                accessorKey: 'main',
                header: 'Główne',
                size: 20,
                Cell: ({cell, row}) => {
                    return (
                        <>
                            <Checkbox checked={Boolean(cell.getValue())} checkedIcon={<Done/>} icon={<Close/>}
                                      disabled/>
                        </>

                    )
                }
            },
            {
                accessorKey: 'order',
                header: 'Kolejność',
                size: 20,
            },
            {
                accessorKey: 'publish',
                header: 'Udostępniony',
                size: 20,
                Cell: ({cell, row}) => {
                    return (
                        <>
                            <Checkbox checked={Boolean(cell.getValue())} checkedIcon={<Done/>} icon={<Close/>}
                                      disabled/>
                        </>

                    )
                }
            },
            {
                accessorKey: 'type',
                header: 'Typ',
                size: 20,
            },
            {
                accessorKey: 'slug',
                header: 'Zdjęcie',
                columnDefType: 'display',
                Cell: ({cell, row}) => {
                    return (
                        <Box
                            component={"img"}
                            src={route("images", {slug: cell.getValue()})}
                        />

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
        groupedColumnMode: "remove",
        enableColumnFilterModes: true,

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
            expanded: true,
            grouping: ['model.symbol', 'color.shortcut', 'color.name'],
            sorting: [
                {
                    id: 'model.symbol',
                    desc: false,
                },
                {
                    id: 'color.shortcut',
                    desc: false,
                },
                {
                    id: 'order',
                    desc: false,
                },
            ]
        },
        // muiTableProps: {
        //     sx: {
        //         display: "grid",
        //         gridTemplateColums: "1fr",
        //         gridTemplateRows: "auto 1fr auto",
        //         height: "100%"
        //     },
        // },
        muiTableContainerProps: {
            sx: {height: "calc(100% - 56px - 56px)"},
        },
        muiTablePaperProps: ({table}) => ({
            sx: {
                pl: 1,
                height: 1
            },
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
        muiTableBodyRowProps: ({row}) => {
            return ({
                sx: {
                    bgcolor: row.original.width != 1280 || row.original.height != 1920 ? "errorBg.main" : ""
                },
            })
        },
    });


    return (
        <MaterialReactTable table={table}/>

    );
}
