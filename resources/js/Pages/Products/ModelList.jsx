import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";
import {Box, Button, Card, Paper, TextField, Typography} from "@mui/material";
import {useSnackbar} from "notistack";
import ModelsTable from "@/Components/Table/ModelsTable";

export default function ModelList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    return (
        <UserLayout auth={props.auth} errors={props.errors} header={"Models"}>
            <Head title="Models"/>

            <Card sx={{height: "100%", width: 1}}>
                <ModelsTable {...props} />
            </Card>
        </UserLayout>
    );
}
