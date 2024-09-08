import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box, Button, Card} from "@mui/material";
import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import WarehouseDocumentEditTable from "@/Components/Table/Warehouse/WarehouseDocumentEditTable";
import {ArrowBack, Save} from "@mui/icons-material";

export default function DocumentList(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();
    console.log(props)

    const data = props.warehouseDocument


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={t("Editing") + " " + data.number}>
            <Head title={t("Editing") + " " + data.number}/>

            <Card sx={{height: "100%", width: 1, display: "flex", flexDirection: "column"}}>
                <WarehouseDocumentEditTable document={data} readOnly={false} props={props}/>
                <Box sx={{p: 1, display: "flex", justifyContent: "flex-end", gap: 2}}>
                    <Button variant="outlined" startIcon={<ArrowBack/>}>Anuluj</Button>
                    <Button variant="contained" startIcon={<Save/>}>Zapisz</Button>
                </Box>
            </Card>
        </UserLayout>
    );
}
