import {useMemo, useState} from "react";
import {router} from "@inertiajs/react";
import {Box, Button, Fab, IconButton, Menu, MenuItem, Stack, TextField, Tooltip, Typography} from "@mui/material";
import {Add, CancelOutlined, CheckCircleOutline, Edit, FileDownload, Visibility} from "@mui/icons-material";
import ClientsAddDialog from "@/Components/Dialogs/ClientsDialog/ClientsAddDialog";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {MRT_Localization_PL} from "material-react-table/locales/pl/index.js";
import {jsPDF} from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import {download, generateCsv, mkConfig} from 'export-to-csv';

export default function ClientsTable(props) {
    // console.log(props)
    const data = props.clients;
    const auth = props.auth;

    const [openDialogAdd, setOpenDialogAdd] = useState(false);

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 10,

            },
            {
                accessorKey: 'blacklist',
                header: 'Czarna lista',
                enableSorting: false,
                size: 70,
                Cell: ({cell}) => {
                    const value = Number(cell.getValue());
                    return value === 1 ? (
                        <Tooltip title={"Tak"} arrow>
                            <CancelOutlined color="error"/>
                        </Tooltip>
                    ) : (
                        <Tooltip title={"Nie"} arrow>
                            <CheckCircleOutline color="success"/>
                        </Tooltip>
                    );
                },
                Filter: ({column}) => (
                    <TextField
                        select
                        label="Czarna lista"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={column.getFilterValue() ?? ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            column.setFilterValue(val === '' ? undefined : Number(val));
                        }}
                        sx={{width: '15ch'}}
                    >
                        <MenuItem value="">Wszyscy</MenuItem>
                        <MenuItem value="1">Tak</MenuItem>
                        <MenuItem value="0">Nie</MenuItem>
                    </TextField>
                ),
                filterFn: (row, _columnId, filterValue) => {
                    if (filterValue === undefined) return true;
                    return Number(row.getValue('blacklist')) === filterValue;
                },
            },
            {
                accessorKey: 'nip',
                header: 'NIP',
                size: 110,
            },
            {
                accessorKey: 'name',
                header: 'Nazwa klienta',
                size: 260,
            },
            {
                id: 'address',
                header: 'Adres',
                size: 180,
                accessorFn: (row) => {
                    // To służy do globalnego filtrowania (np. przez szybkie wyszukiwanie)
                    return `${row.city ?? ''} ${row.street ?? ''} ${row.building_number ?? ''} ${row.apartment_number ?? ''}`.trim();
                },
                filterFn: (row, columnId, filterValue) => {
                    // Własny sposób filtrowania po kilku polach
                    const city = row.original.city?.toLowerCase() ?? '';
                    const street = row.original.street?.toLowerCase() ?? '';
                    const building = String(row.original.building_number ?? '');
                    const apartment = String(row.original.apartment_number ?? '');
                    const search = filterValue.toLowerCase();

                    return (
                        city.includes(search) ||
                        street.includes(search) ||
                        building.includes(search) ||
                        apartment.includes(search)
                    );
                },
                Cell: ({row}) => {
                    const {city, street, building_number, apartment_number} = row.original;
                    return (
                        <Typography variant="body2" sx={{whiteSpace: 'normal', lineHeight: 1.3}}>
                            {city && <strong>{city}</strong>}<br/>
                            {street && `${street} ${building_number ?? ''}${apartment_number ? '/' + apartment_number : ''}`}
                        </Typography>
                    );
                },
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 120,
            },
            {
                accessorKey: 'phone',
                header: 'Telefon',
                size: 100,
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue) return true;
                    const normalize = (val) =>
                        String(val ?? '')
                            .replace(/[\s\-+]/g, '') // usuń spacje, myślniki, plusy
                            .trim();
                    const rowValue = normalize(row.getValue(columnId));
                    const filterNorm = normalize(filterValue);
                    return rowValue.includes(filterNorm);
                },
            },
            {
                accessorKey: 'status_id',
                header: 'Status',
                size: 100,
                Cell: ({cell}) => {
                    const value = cell.getValue();
                    let label = '';
                    let color = 'text.primary';

                    switch (value) {
                        case 1:
                            label = 'Nieaktywny';
                            color = 'text.secondary';
                            break;
                        case 2:
                            label = 'Aktywny';
                            color = 'success.main';
                            break;
                        case 3:
                            label = 'Potencjalny';
                            color = 'warning.main';
                            break;
                        default:
                            label = '-';
                    }

                    return <Typography sx={{color}}>{label}</Typography>;
                },
                Filter: ({column}) => (
                    <TextField
                        select
                        label="Status"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={column.getFilterValue() ?? ''}
                        onChange={(e) =>
                            column.setFilterValue(e.target.value === '' ? undefined : Number(e.target.value))
                        }
                        sx={{width: '15ch'}}
                    >
                        <MenuItem value="">Wszyscy</MenuItem>
                        <MenuItem value={1}>Nieaktywny</MenuItem>
                        <MenuItem value={2}>Aktywny</MenuItem>
                        <MenuItem value={3}>Potencjalny</MenuItem>
                    </TextField>
                ),
                filterFn: (row, _columnId, filterValue) => {
                    if (filterValue === undefined) return true;
                    return row.getValue('status_id') === filterValue;
                },
            },
            {
                accessorKey: 'account_manager.name',
                header: 'Opiekun',
                size: 120,
                Cell: ({row}) => (
                    <Typography variant="body2">
                        {row.original?.account_manager?.name ?? '-'}
                    </Typography>
                ),
                // komponent filtrowania
                Filter: ({column}) => {
                    // Lista unikalnych opiekunów z danych tabeli
                    const uniqueManagers = useMemo(() => {
                        const managers = column
                            .getFacetedRowModel()
                            ?.rows
                            ?.flatMap(row => row.original.account_manager?.name || []);
                        return [...new Set(managers.filter(Boolean))]; // usuń duplikaty i puste
                    }, [column]);

                    return (
                        <TextField
                            select
                            label="Filtruj opiekuna"
                            size="small"
                            variant="outlined"
                            fullWidth
                            value={column.getFilterValue() ?? ''}
                            onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                            sx={{width: '15ch'}}
                        >
                            <MenuItem value="">Wszyscy</MenuItem>
                            {uniqueManagers.map((manager) => (
                                <MenuItem key={manager} value={manager}>
                                    {manager}
                                </MenuItem>
                            ))}
                        </TextField>
                    );
                },
                filterFn: 'equals', // filtr dokładnego dopasowania
            },
            {
                id: 'actions',
                header: 'Akcje',
                size: 120,
                enableColumnFilter: false,
                enableSorting: false,
                Cell: ({row}) => (
                    <Stack direction="row" spacing={1}>
                        {auth.permissions.includes("showClient") && (
                            <Tooltip title="Pokaż">
                                <IconButton
                                    color="primary"
                                    onClick={() => router.get(
                                        route("system.clients.client", {id: row.original.id})
                                    )}
                                >
                                    <Visibility fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        )}
                        {auth.permissions.includes("editClient") && (
                            <Tooltip title="Edycja">
                                <IconButton
                                    color="secondary"
                                    onClick={() => router.get(
                                        route("system.clients.client.edit", {id: row.original.id})
                                    )}
                                >
                                    <Edit fontSize="small"/>
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                ),
            },
        ], [props]);


    const table = useMaterialReactTable({
        data,
        columns,
        enableTopToolbar: true,
        enableBottomToolbar: true,
        enableGrouping: true,
        enableColumnResizing: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        localization: MRT_Localization_PL,
        columnFilterDisplayMode: 'popover',
        initialState: {
            columnVisibility: {id: false,},
            density: 'compact',
            pagination: {pageSize: 50, pageIndex: 0},
            sorting: [
                {
                    id: 'id',
                    desc: false,
                },
            ]
        },
        muiTableContainerProps: {
            sx: {
                flex: 1,
            }
        },
        // muiTable mui Table ustawienie poprawne
        muiTablePaperProps: ({table}) => ({
            sx: {
                pl: 1,
                flex: 1,
                display: "flex",
                flexDirection: "column",
            },
            elevation: 1,
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
        muiTableBodyRowProps: ({row}) => {
            // console.log(row.original, row.original.Rozliczenie, row.original.Wartosc, row.original.DniSpoznienia)
            return ({
                sx: {
                    // bgcolor: row.original.Rozliczenie != 2 ? row.original.DniSpoznienia != null ? Number(row.original.Wartosc) > 0 ? "errorBg.main" : "" : "" : ""
                },
            })
        },
        muiBottomToolbarProps: ({row}) => {
            return ({
                sx: {
                    marginRight: '60px',
                }
            })
        },
        renderTopToolbarCustomActions: ({table}) => (
            <Box sx={{display: 'flex', gap: 1, padding: '8px'}}>
                <ClientsTableToolbar table={table} columns={columns}/>
            </Box>
        ),
    });


    return (
        <>
            <MaterialReactTable table={table}/>
            <Box sx={{position: "absolute", bottom: 10, right: 10, zIndex: 20}}>
                <Fab color="primary" aria-label="add" onClick={() => {
                    setOpenDialogAdd(true)
                }}>
                    <Add/>
                </Fab>
            </Box>
            <ClientsAddDialog open={openDialogAdd} setOpen={setOpenDialogAdd} country={props.country}/>
        </>


    );
}
const ClientsTableToolbar = ({table, columns}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const getExportData = (rows, removeAddtionalInfo = true) => {
        const headers = columns.map((col) => col.header || col.accessorKey);
        headers.shift();
        headers.pop();
        // console.log(rows, columns);
        const data = rows.map((row) => {
            // const col = columns.map((col) => row[col.accessorKey] ?? '');
            const col = [];

            col.push(row['id']);
            col.push(row['blacklist'] === 1 ? 'Tak' : removeAddtionalInfo ? '' : 'Nie');
            col.push(row['nip']);
            col.push(row['name']);
            col.push(`${row['city'] ?? ''} ${row['street'] ?? ''} ${row['building_number'] ?? ''} ${row['apartment_number'] ?? ''}`.trim());
            col.push(row['email']);
            col.push(row['phone']);
            col.push(row['status_id'] === 1 ? 'Nieaktywny' : row['status_id'] === 2 ? 'Aktywny' : row['status_id'] === 3 ? 'Potencjalny' : '-');
            col.push(row['account_manager']?.name ?? '-');

            col.shift();
            // console.log(columns, row, col);
            return col;
        });

        return {headers: headers, data: data};
    }

    const handleExportCSV = () => {
        const rows = table.getPrePaginationRowModel().rows.map((row) => row.original);

        const {headers, data} = getExportData(rows, false);
        // console.log(headers);
        const csvConfig = mkConfig({
            fieldSeparator: ',',
            decimalSeparator: '.',
            useKeysAsHeaders: false,
            columnHeaders: headers,
            filename: 'clients',
            fileExtension: 'csv',
        });

        // console.log(headers, data);
        const rows2 = data.map(row => Object.fromEntries(headers.map((key, i) => [key, row[i]])))

        const csv = generateCsv(csvConfig)(rows2);
        download(csvConfig)(csv);
        handleClose();
    };

    const handleExportPDF = () => {
        const rows = table.getPrePaginationRowModel().rows.map((row) => row.original);
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'a4',
        });

        const {headers, data} = getExportData(rows);

        autoTable(doc, {
            head: [headers], body: data, styles: {
                fontSize: 8,
            }, columnStyles: {
                0: {cellWidth: 30},  // Blacklist column
                1: {cellWidth: 60}, // NIP column
                2: {cellWidth: 200}, // Name column
                3: {cellWidth: 150}, // Address column
                4: {cellWidth: 120}, // Email column
                5: {cellWidth: 80},  // Phone column
                6: {cellWidth: 70},  // Status column
                7: {cellWidth: 60},  // Account Manager column
            }
        });
        doc.save('clients_export_all_rows.pdf');
        handleClose();
    };

    return (
        <>
            <Button
                startIcon={<FileDownload/>}
                variant="contained"
                size="small"
                onClick={handleClick}
            >
                Eksport
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleExportCSV}>CSV</MenuItem>
                <MenuItem onClick={handleExportPDF}>PDF</MenuItem>
            </Menu>
        </>
    );
};
