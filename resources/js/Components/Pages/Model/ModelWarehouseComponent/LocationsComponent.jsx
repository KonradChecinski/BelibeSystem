import {
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Paper, Button,
} from "@mui/material";
import {Add, Delete, Star, StarBorder} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {Link, router, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import ModelDeleteLocationDialog
    from "@/Components/Dialogs/ModelWarehouseLocationDialog/ModelWarehouseLocationDeleteDialog";
import AddModelLocationDialog from "@/Components/Dialogs/ModelWarehouseLocationDialog/ModelWarehouseLocationAddDialog";

export default function LocationsComponent(props) {
    const productModel_id = props.productModel.id;
    const assignedShelves = props.productModel.warehouse_locations_with_room_and_aisle || [];

    const [openDeleteDialogId, setOpenDeleteDialogId] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);


    // Ustawienie półki głównej
    const handleSetMain = (shelfId) => {
        router.patch(route("system.products.model.warehouse.main", {
            productModel: productModel_id,
            warehouseLocation: shelfId
        }), {
            main: true,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                enqueueSnackbar("Półka została ustawiona jako główna", {variant: 'success'});
            },
            onError: (error) => {
                console.error(error);
                enqueueSnackbar("Błąd podczas ustawiania półki jako głównej", {variant: 'error'});
                for (const errorsKey in errors) {
                    enqueueSnackbar(errors[errorsKey], {variant: 'error'})
                }
            }
        })
    };
    console.log(props.locations);

    return (
        <Paper elevation={3} sx={{position: "relative", padding: 2, marginTop: 2}}>
            <Typography variant="h6" gutterBottom>
                Lokalizacje magazynowe modelu
            </Typography>
            {props.editing ?
                <>
                    <Button variant="outlined" startIcon={<Add/>}
                            onClick={() => setOpenAddDialog(true)}
                            sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                            }}>
                        Dodaj
                    </Button>
                    <AddModelLocationDialog open={openAddDialog} setOpen={setOpenAddDialog}
                                            locations={props.locations} productModel_id={productModel_id}/>
                </> : null
            }

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Główna</TableCell>
                        <TableCell>Pokój</TableCell>
                        <TableCell>Aleja</TableCell>
                        <TableCell>Półka</TableCell>
                        <TableCell align={"right"}>Akcje</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assignedShelves.sort((a, b) => b.pivot.is_main - a.pivot.is_main).map((row) => (
                        <TableRow key={row.id} hover sx={{bgcolor: row.pivot.is_main ? 'successBg.main' : ''}}>
                            <TableCell>
                                <IconButton onClick={() => handleSetMain(row.id)} disabled={row.pivot.is_main}>
                                    {row.pivot.is_main ? (
                                        <Star color="warning"/>
                                    ) : (
                                        <StarBorder/>
                                    )}
                                </IconButton>
                            </TableCell>
                            <TableCell>{row.room?.name}</TableCell>
                            <TableCell>{row.aisle?.name}</TableCell>
                            <TableCell>{row.name}</TableCell>

                            <TableCell align={"right"}>
                                <IconButton onClick={() => setOpenDeleteDialogId(row.id)}>
                                    <Delete/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ModelDeleteLocationDialog
                open={openDeleteDialogId}
                setOpen={setOpenDeleteDialogId}
                productModel_id={productModel_id}
                shelf={assignedShelves.find(shelf => shelf.id === openDeleteDialogId)}
            />
        </Paper>
    );
}
