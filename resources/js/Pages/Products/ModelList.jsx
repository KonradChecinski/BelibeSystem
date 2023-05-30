import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import ModelsTable from "@/Components/Table/ModelsTable";

export default function ModelList(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    return (
        <UserLayout auth={props.auth} errors={props.errors} header={"Models"}>
            <Head title="Dashboard" />

            <Paper>
                <ModelsTable {...props} />
            </Paper>
        </UserLayout>
    );
}
