import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import AcquisitionTable from "@/Components/Table/Settings/AcquisitionTable";

export default function Acquisition(props) {
    // console.log(props)
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={
                t("Source of acquisitions")
            }
        >
            <Head title={t("Source of acquisitions")}/>
            <Card sx={{height: "100%", width: 1}}>
                <AcquisitionTable {...props} />
            </Card>
        </UserLayout>
    );
}
