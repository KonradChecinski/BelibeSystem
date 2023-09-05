import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import RolesTable from "@/Components/Table/RolesTable";

export default function Sizes(props) {
    console.log(props)
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                "Sizes"
            }
        >
            <Head title="Sizes"/>
            <Card sx={{height: "100%", width: 1}}>
                <RolesTable {...props} />
            </Card>
        </UserLayout>
    );
}
