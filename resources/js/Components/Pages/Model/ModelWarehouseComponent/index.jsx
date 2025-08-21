import {
    Autocomplete,
    Box, Button,
    Fade,
    TextField,
    Typography
} from "@mui/material";
import {Print, Save} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {Link, useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import LocationsComponent from "@/Components/Pages/Model/ModelWarehouseComponent/LocationsComponent";


export default function ModelWarehouseComponent(props) {
    // const [edited, setEdited] = useState(false);
    //
    // const {
    //     register,
    //     handleSubmit,
    //     errors: fieldErrors,
    //     setValue,
    // } = useModelGS1Form()
    //
    // const {data, setData, processing, post} = useForm({
    //     'product_gs1_brand_id': props.productModel.product_gs1_brand_id,
    //     'product_gs1_gpc_id': props.productModel.product_gs1_gpc_id,
    //
    //     'gs1_gpc': props.productModel.gs1_gpc,
    //     'gs1_brand': props.productModel.gs1_brand,
    // })
    //
    // useEffect(() => {
    //     // inicjacja wartości pól
    //     setValue("gs1_gpc", data.gs1_gpc?.name)
    //     setValue("gs1_brand", data.gs1_brand?.name)
    // }, [setValue]);

    const onSubmit = (formData) => {
        // console.log("GS1 form data: ", formData)
        // console.log("GS1 data: ", data)
        // saveGS1()
    }
    console.log(props.productModel.warehouse_locations_with_room_and_aisle)

    // const saveGS1 = () => {
    //     post(route("system.products.model.update.gs1", {productModel: props.productModel.id}), {
    //         onSuccess: params => {
    //             setEdited(false);
    //             enqueueSnackbar("Zapisano GS1", {variant: 'success'})
    //         },
    //         onError: params => {
    //             console.error(params)
    //             enqueueSnackbar("Błąd przy zapisywaniu GS1", {variant: 'error'})
    //         },
    //         preserveScroll: true
    //     })
    // }

    return (
        // <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

        <Box sx={{display: "flex", flexDirection: "column", flexWrap: "wrap", gap: 5, mt: 2}}>
            <Box>
                <LocationsComponent {...props}/>
            </Box>
            <Box>
                <a
                    href={route("system.products.model.warehouse.print", {productModel: props.productModel.id})}
                    target={"_blank"}
                >
                    <Button variant="outlined" startIcon={<Print/>} sx={{width: "40ch", height: 50}}>
                        Generuj etykietę na kosz
                    </Button>
                </a>
            </Box>


            {/*<Fade in={edited}>*/}
            {/*    <Button type="submit" variant="outlined" startIcon={<Save/>}*/}
            {/*            disabled={processing}*/}
            {/*            sx={{*/}
            {/*                position: "absolute",*/}
            {/*                top: 7,*/}
            {/*                right: 100,*/}
            {/*            }}>*/}
            {/*        Zapisz*/}
            {/*    </Button>*/}
            {/*</Fade>*/}
        </Box>

        // </form>
    );
}

