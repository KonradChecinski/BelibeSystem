import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";
import { Button, Paper } from "@mui/material";
import { useSnackbar } from "notistack";
import Table from "@/Components/Table";

export default function ModelList(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    return (
        <UserLayout auth={props.auth} errors={props.errors} header={"Models"}>
            <Head title="Dashboard" />

            <Paper>
                <Table
                    url={route(route().current()) + "/data"}
                    column={[
                        { field: "id", headerName: "Id" },
                        { field: "symbol", headerName: "Symbol" },
                        {
                            field: "name",
                            headerName: "Name",
                            flex: 1,
                        },
                    ]}
                    columnVisibility={{
                        id: false,
                    }}
                />
            </Paper>
        </UserLayout>
    );
}
