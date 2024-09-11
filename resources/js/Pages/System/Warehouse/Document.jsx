import {Head, useForm} from "@inertiajs/react";
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

    const productsQuantityHistory = JSON.parse(JSON.stringify(props.warehouseDocument.warehouse_document_products))


    // const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm(props.warehouseDocument)
    const {
        data,
        setData,
        processing,
    } = useForm(JSON.parse(JSON.stringify(props.warehouseDocument.warehouse_document_products)))
    const productsHistory2 = JSON.parse(JSON.stringify(props.warehouseDocument.warehouse_document_products))


// A comparer object to determine if two entries are equal.
    const isSameObject = (a, b) => a.id === b.id && a.quantity === b.quantity;

    // Get items that only occur in the left array,
// using the compareFunction to determine equality.
    const onlyInLeft = (left, right, compareFunction) =>
        left.filter(
            leftValue => !right.some(rightValue => compareFunction(leftValue, rightValue))
        );


    const handleCancel = () => {
        history.back();
    }
    const handleSave = () => {
        console.log(tableData)
        console.log(props.warehouseDocument)
        console.log(data, productsQuantityHistory)
        const onlyInA = onlyInLeft(data, productsHistory2, isSameObject);
        const onlyInB = onlyInLeft(productsHistory2, data, isSameObject);
        // const symDifference = onlyInA.concat(onlyInB);

        console.log(onlyInA, onlyInB)
    }

    return (
        <UserLayout auth={props.auth} errors={props.errors}
                    header={t("Editing") + " " + props.warehouseDocument.number}>
            <Head title={t("Editing") + " " + props.warehouseDocument.number}/>

            <Card sx={{height: "100%", width: 1, display: "flex", flexDirection: "column"}}>
                <WarehouseDocumentEditTable

                    props={props}
                />
            </Card>
        </UserLayout>
    );
}
