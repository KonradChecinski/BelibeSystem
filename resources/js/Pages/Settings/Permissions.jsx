import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";
import {Card} from "@mui/material";

export default function Permissions(props) {
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                "Permissions"
            }
        >
            <Head title="Permissions"/>
            <Card sx={{height: "100%", width: 1}}>

            </Card>
        </UserLayout>
    );
}
