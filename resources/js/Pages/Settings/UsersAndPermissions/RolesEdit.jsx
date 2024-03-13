import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import RolesEditTable from "@/Components/Table/Settings/RolesEditTable";

export default function Roles(props) {
    console.log(props)
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                "Roles edit: " + props.role.name
            }
        >
            <Head title={"Roles edit: " + props.role.name}/>
            <Card sx={{height: "100%", width: 1}}>
                <RolesEditTable {...props}/>
            </Card>
        </UserLayout>
    );
}
