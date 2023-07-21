import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";
import ModelsTable from "@/Components/Table/ModelsTable";
import {Card} from "@mui/material";
import UsersTable from "@/Components/Table/UsersTable";

export default function Roles(props) {
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                "Roles"
            }
        >
            <Head title="Roles"/>
            <Card sx={{height: "100%", width: 1}}>
                
            </Card>
        </UserLayout>
    );
}
