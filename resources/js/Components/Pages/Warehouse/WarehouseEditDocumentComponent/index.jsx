import WarehouseDocumentEditTable from "@/Components/Table/Warehouse/WarehouseDocumentEditTable";
import {Box, Button} from "@mui/material";
import {ArrowBack, Save} from "@mui/icons-material";
import {useForm} from "@inertiajs/react";
import {useState} from "react";
import DifferenceDialog from "@/Components/Dialogs/WarehouseDialog/DifferenceDialog";


export default function WarehouseEditDocument({props}) {
    const [openSaveModal, setOpenSaveModal] = useState(false)
    const [productsQuantityHistory, setProductsQuantityHistory] = useState(JSON.parse(JSON.stringify(props.warehouseDocument.warehouse_document_products)))
    const productsHistory2 = JSON.parse(JSON.stringify(props.warehouseDocument.warehouse_document_products))

    // const {data, setData, post, patch, processing, errors, clearErrors, reset} = useForm(props.warehouseDocument)
    const {
        data,
        setData,
        processing,
    } = useForm(JSON.parse(JSON.stringify(props.warehouseDocument.warehouse_document_products)))


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
    const handleOpenSaveModal = () => {
        console.log(props.warehouseDocument)
        console.log(productsQuantityHistory)
        console.log(data, productsHistory2)
        const onlyInA = onlyInLeft(data, productsHistory2, isSameObject);
        const onlyInB = onlyInLeft(productsHistory2, data, isSameObject);


        console.log(onlyInA, onlyInB)
        setOpenSaveModal(true)
    }

    return (
        <>
            <WarehouseDocumentEditTable
                data={data}
                setData={setData}
                productsQuantityHistory={productsQuantityHistory}
                setProductsQuantityHistory={setProductsQuantityHistory}
                props={props}
            />
            <Box sx={{p: 1, display: "flex", justifyContent: "flex-end", gap: 2}}>
                <Button variant="outlined" startIcon={<ArrowBack/>} onClick={handleCancel}>Anuluj</Button>
                <Button variant="contained" startIcon={<Save/>} onClick={handleOpenSaveModal}>Zapisz</Button>
            </Box>
            <DifferenceDialog open={openSaveModal} setOpen={setOpenSaveModal} data={data} processing={processing}
                              params={props}/>
        </>

    );
}
