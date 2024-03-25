import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import BrandsTable from "@/Components/Table/Settings/BrandsTable";
import QueryImagesTable from "@/Components/Table/Queries/QueryImagesTable";

export default function QueryImages(props) {
    console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Images")
            }
        >
            <Head title={t("Images")}/>
            <Card sx={{height: "100%", width: 1}}>
                <QueryImagesTable images={props.images} props={props}/>
            </Card>
        </UserLayout>
    );
}
