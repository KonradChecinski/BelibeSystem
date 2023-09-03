import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";
import {Card} from "@mui/material";
import UsersTable from "@/Components/Table/UsersTable";

export default function Dashboard2(props) {
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                "Users"
            }
        >
            <Head title="Users"/>
            <Card sx={{height: "100%", width: 1}}>
                <UsersTable {...props} />
            </Card>
        </UserLayout>
    );
}
