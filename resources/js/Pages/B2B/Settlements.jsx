import {Head, Link} from "@inertiajs/react";
import ClientLayout from "@/Layouts/ClientLayout";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import B2bSettlementsTable from "@/Components/Table/B2B/Settlements";

export default function B2bSettlements(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)
    return (
        <ClientLayout
            props={props}
            header={
                t("Settlements")
            }
        >
            <Head title={t("Settlements")}/>
            <B2bSettlementsTable settlements={props.settlements} props={props}/>

        </ClientLayout>
    );
}
