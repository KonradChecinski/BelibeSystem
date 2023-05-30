import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";
import { Box, Button, Card, CardActions, CardContent, Grid, Paper, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import ModelsTable from "@/Components/Table/ModelsTable";
import { Category, Palette } from "@mui/icons-material";
import IconGrid from "@/Components/IconGrid";

export default function Model(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    console.log(props);
    return (

        <UserLayout auth={props.auth} errors={props.errors} header={"Model: " + props.productModel.name}>
            <Head title="Dashboard" />
            <Grid container spacing={2}>
                <IconGrid xs={12} md={12} title={"Kolory"} icon={<Palette />} iconColor={"green"} />
                <IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />
                <IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />
                <IconGrid xs={12} md={12} icon={<Palette />} iconColor={"green"} />
                <IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />
                <IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />
            </Grid>


            <Paper>
                {/*<ModelsTable {...props} />*/}
            </Paper>
        </UserLayout>
    );
}
