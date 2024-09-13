import WarehouseDocumentEditTable from "@/Components/Table/Warehouse/WarehouseDocumentEditTable";
import {Box, Button} from "@mui/material";
import {ArrowBack, Save} from "@mui/icons-material";
import {useForm} from "@inertiajs/react";
import {useState} from "react";
import DifferenceDialog from "@/Components/Dialogs/WarehouseDialog/DifferenceDialog";


export default function WarehouseEditDocument({props}) {
    const [openSaveModal, setOpenSaveModal] = useState(false)
    const [saveModalData, setSaveModalData] = useState(null)
    const [productsQuantityHistory, setProductsQuantityHistory] = useState(JSON.parse(JSON.stringify(props.warehouseDocument.warehouse_document_products)))
    const productsHistory = JSON.parse(JSON.stringify(props.warehouseDocument.warehouse_document_products))

    const {
        data,
        setData,
        put,
        transform,
        processing,
    } = useForm(JSON.parse(JSON.stringify(props.warehouseDocument.warehouse_document_products)))

    transform((data) =>
        data.map(e => ({
            // ...e,
            id: e.id.toString().includes("added_") ? null : e.id,
            quantity: e.quantity,
            product: {
                id: e.product.id
            },
        }))
    );


    // A comparer object to determine if two entries are equal.
    const isSameObjectIdAndQuantity = (a, b) => a.id === b.id && a.quantity === b.quantity;
    const isSameObjectId = (a, b) => a.id === b.id;

    // Get items that only occur in the left array,
    // using the compareFunction to determine equality.
    const onlyInLeft = (left, right, compareFunction) =>
        left.filter(leftValue => !right.some(rightValue => compareFunction(leftValue, rightValue)));

    const onlyInIntersection = (left, right, compareFunction) =>
        left.filter(leftValue => right.some(rightValue => compareFunction(leftValue, rightValue)));


    const handleCancel = () => {
        history.back();
    }

    const handleOpenSaveModal = () => {
        console.log(props.warehouseDocument)
        console.log(productsQuantityHistory)
        console.log(data, productsHistory)
        const before = onlyInLeft(productsHistory, data, isSameObjectIdAndQuantity);
        const after = onlyInLeft(data, productsHistory, isSameObjectIdAndQuantity);
        console.log(before, after)

        const onlyInA = onlyInLeft(before, after, isSameObjectId);
        const intersectionAB = onlyInIntersection(before, after, isSameObjectId);
        const onlyInB = onlyInLeft(after, before, isSameObjectId);


        const onlyInAIds = onlyInA.map((item) => item.id)
        const intersectionABIds = intersectionAB.map((item) => item.id)
        const onlyInBIds = onlyInB.map((item) => item.id)
        // console.log(onlyInA, intersectionAB, onlyInB)
        // console.log(onlyInA.map((item) => item.id), intersectionAB.map((item) => item.id), onlyInB.map((item) => item.id))

        console.log({
            before: before,
            after: after,
            onlyInAIds: onlyInAIds,
            intersectionABIds: intersectionABIds,
            onlyInBIds: onlyInBIds
        })
        setOpenSaveModal(true)
        setSaveModalData({
            before: before,
            after: after,
            onlyInAIds: onlyInAIds,
            intersectionABIds: intersectionABIds,
            onlyInBIds: onlyInBIds
        });
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
                <Button
                    variant="contained"
                    startIcon={<Save/>}
                    onClick={handleOpenSaveModal}
                    disabled={processing || (onlyInLeft(productsHistory, data, isSameObjectIdAndQuantity).length === 0 && onlyInLeft(data, productsHistory, isSameObjectIdAndQuantity).length === 0)}
                >Zapisz</Button>
            </Box>
            <DifferenceDialog
                open={openSaveModal}
                setOpen={setOpenSaveModal}
                data={saveModalData}
                processing={processing}
                put={put}
                props={props}
            />
        </>

    );
}
