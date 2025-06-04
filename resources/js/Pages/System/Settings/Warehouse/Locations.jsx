import {Head, Link} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Fab,
    Grid,
    IconButton,
    Paper,
    Tooltip,
    Typography
} from "@mui/material";
import {useState} from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates, useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {Add, Delete, DragIndicator, Edit} from "@mui/icons-material";
import LocationsComponent from "@/Components/Pages/Settings/Warehouse/LocationsComponent";


export default function Locations(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Locations")
            }
        >
            <Head title={t("Locations")}/>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{p: 2}}>
                        <LocationsComponent {...props} />
                    </Paper>
                </Grid>
            </Grid>


        </UserLayout>
    );
}
