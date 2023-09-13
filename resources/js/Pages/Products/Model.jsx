import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Grid} from "@mui/material";
import {useSnackbar} from "notistack";
import {Category, Palette} from "@mui/icons-material";
import IconGrid from "@/Components/IconGrid";
import {useState} from "react";
import ModelColorComponent from "@/Components/Pages/Model/ModelColorComponent";
import ImagesComponent from "@/Components/Pages/Model/ImagesComponent";
import ModelPricesComponent from "@/Components/Pages/Model/ModelPricesComponent";
import ModelB2BComponent from "@/Components/Pages/Model/ModelB2BComponent";
import BasicInfoComponent from "@/Components/Pages/Model/BasicInfoComponent";
import ModelB2CComponent from "@/Components/Pages/Model/ModelB2CComponent";

export default function Model(props) {


    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [productModel, setProductModel] = useState({
        ...props.productModel,
        categories: props.productModel.categories.map((value) => {
            // delete value.pivot;
            return value.id;
        })
    });
    console.log(props);


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={"Model: " + props.productModel.name}>
            <Head title={props.productModel.name}/>
            <Grid container spacing={3} sx={{pb: 1}}>
                <IconGrid xs={12} md={12} title={"Podstawowe informacje"} icon={<Category/>} iconColor={"green"}>
                    <BasicInfoComponent {...props}/>
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Ceny"} icon={<Palette/>} iconColor={"green"}>
                    <ModelPricesComponent {...props} />
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Kolory"} icon={<Palette/>} iconColor={"blue"}>
                    <ModelColorComponent {...props} />
                </IconGrid>
                <IconGrid xs={12} md={12} title={"B2C"} icon={<Palette/>} iconColor={"green"}>
                    <ModelB2CComponent productModel={productModel} setProductModel={setProductModel}
                                       props={{...props}}/>

                </IconGrid>
                <IconGrid xs={12} md={12} title={"B2B"} icon={<Palette/>} iconColor={"green"}>
                    <ModelB2BComponent productModel={productModel} setProductModel={setProductModel}
                                       props={{...props}}/>
                </IconGrid>
                {/*<IconGrid xs={12} md={12} title={"Allegro"} icon={<Palette/>} iconColor={"green"}>*/}
                {/*    <TextEditorAllegro/>*/}
                {/*</IconGrid>*/}

                <IconGrid xs={12} md={12} title={"Zdjęcia"} icon={<Category/>} iconColor={"blue"}>
                    <ImagesComponent {...props}/>
                </IconGrid>

                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
            </Grid>

        </UserLayout>
    );
}

