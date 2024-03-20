import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Grid} from "@mui/material";
import {Palette} from "@mui/icons-material";
import IconGrid from "@/Components/Layout/IconGrid";
import {useState} from "react";
import ModelColorComponent from "@/Components/Pages/Model/ModelColorComponent";
import ImagesComponent from "@/Components/Pages/Model/ImagesComponent";
import ModelPricesComponent from "@/Components/Pages/Model/ModelPricesComponent";
import ModelB2BComponent from "@/Components/Pages/Model/ModelB2BComponent";
import BasicInfoComponent from "@/Components/Pages/Model/BasicInfoComponent";
import ModelB2CComponent from "@/Components/Pages/Model/ModelB2CComponent";
import ModelSubiektComponent from "@/Components/Pages/Model/ModelSubiektComponent";
import ModelGS1Component from "@/Components/Pages/Model/ModelGS1Component";
import InfoIcon from '@mui/icons-material/Info';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import QrCodeIcon from '@mui/icons-material/QrCode';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import WorkIcon from '@mui/icons-material/Work';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import TextEditorAllegro from "@/Components/TextEditor/Allegro";

export default function Model(props) {
    // console.log(props);

    return (
        <UserLayout auth={props.auth} errors={props.errors}
                    header={"Model: " + props.productModel.symbol + " - " + props.productModel.name}>
            <Head title={props.productModel.symbol + " - " + props.productModel.name}/>
            <Grid container spacing={3} sx={{pb: 1}}>
                <IconGrid xs={12} md={12} title={"Podstawowe informacje"} icon={<InfoIcon/>} iconColor={"darkblue"}>
                    <BasicInfoComponent {...props}/>
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Ceny"} icon={<MonetizationOnIcon/>}
                          iconColor={"green"}>
                    <ModelPricesComponent {...props} />
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Kolory"} icon={<Palette/>} iconColor={"magenta"}>
                    <ModelColorComponent {...props} />
                </IconGrid>
                <IconGrid xs={12} md={12} title={"Subiekt"} icon={<TextSnippetIcon/>} iconColor={"gray"}>
                    <ModelSubiektComponent {...props}/>
                </IconGrid>
                <IconGrid xs={12} md={12} title={"GS1"} icon={<QrCodeIcon/>} iconColor={"darkcyan"}>
                    <ModelGS1Component  {...props}/>
                </IconGrid>
                <IconGrid xs={12} md={12} title={"B2C"} icon={<PeopleAltIcon/>} iconColor={"indigo"}>
                    <ModelB2CComponent {...props}/>
                </IconGrid>
                <IconGrid xs={12} md={12} title={"B2B"} icon={<WorkIcon/>} iconColor={"indigo"}>
                    <ModelB2BComponent {...props}/>
                </IconGrid>
                {/*<IconGrid xs={12} md={12} title={"Allegro"} icon={<Palette/>} iconColor={"green"}>*/}
                {/*    <TextEditorAllegro/>*/}
                {/*</IconGrid>*/}

                <IconGrid xs={12} md={12} title={"Zdjęcia"} icon={<PhotoSizeSelectActualIcon/>}
                          iconColor={"cyan"}>
                    <ImagesComponent {...props}/>
                </IconGrid>

            </Grid>

        </UserLayout>
    );
}

