import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";

export default function Dashboard2(props) {
    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                "Users Settings"
            }
        >
            <Head title="Users Settings" />

        </UserLayout>
    );
}
