import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Card} from "@mui/material";
import {useLaravelReactI18n} from "laravel-react-i18n";
import B2CSizeChartTable from "@/Components/Table/Settings/B2CSizeChartTable";

export default function SizeChart(props) {
    const {t} = useLaravelReactI18n();

    return (
        <UserLayout
            auth={props.auth}
            errors={props.errors}
            header={t("Tabele rozmiarów")}
        >
            <Head title={t("Tabele rozmiarów")}/>
            <Card sx={{height: "100%", width: 1}}>
                <B2CSizeChartTable {...props} />
            </Card>
        </UserLayout>
    );
}

