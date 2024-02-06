import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Grid} from "@mui/material";
import IconGrid from "@/Components/IconGrid";
import InfoIcon from '@mui/icons-material/Info';
import BasicClientInfoComponent from "@/Components/Pages/Client/BasicClientInfoComponent";
import AdditionalClientInfoComponent from "@/Components/Pages/Client/AdditionalClientInfoComponent";
import AddBoxIcon from '@mui/icons-material/AddBox';
import NotesClientComponent from "@/Components/Pages/Client/NotesClientComponent";
import NoteAddIcon from '@mui/icons-material/NoteAdd';


export default function Client(props) {

    // const [productModel, setProductModel] = useState({
    //     ...props.productModel,
    //     categories: props.productModel.categories.map((value) => {
    //         // delete value.pivot;
    //         return value.id;
    //     })
    // });
    console.log(props);


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={"Klient: " + "test"}>
            <Head title={"test"}/>
            <Grid container spacing={3} sx={{pb: 1}}>
                <IconGrid xs={12} md={12} title={"Informacje podstawowe"} icon={<InfoIcon/>} iconColor={"darkblue"}>
                    <BasicClientInfoComponent {...props}/>
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Informacje dodatkowe"} icon={<AddBoxIcon/>}
                          iconColor={"green"}>
                    <AdditionalClientInfoComponent {...props} />
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Notatki do klienta"} icon={<NoteAddIcon/>} iconColor={"magenta"}>
                    <NotesClientComponent {...props} />
                </IconGrid>
                {/*<IconGrid xs={12} md={12} title={"Subiekt"} icon={<TextSnippetIcon/>} iconColor={"gray"}>*/}
                {/*    <ModelSubiektComponent productModel={productModel} setProductModel={setProductModel}*/}
                {/*                           props={{...props}}/>*/}
                {/*</IconGrid>*/}
                {/*<IconGrid xs={12} md={12} title={"GS1"} icon={<QrCodeIcon/>} iconColor={"darkcyan"}>*/}
                {/*    <ModelGS1Component productModel={productModel} setProductModel={setProductModel}*/}
                {/*                       props={{...props}}/>*/}
                {/*</IconGrid>*/}
                {/*<IconGrid xs={12} md={12} title={"B2C"} icon={<PeopleAltIcon/>} iconColor={"indigo"}>*/}
                {/*    <ModelB2CComponent productModel={productModel} setProductModel={setProductModel}*/}
                {/*                       props={{...props}}/>*/}
                {/*</IconGrid>*/}
                {/*<IconGrid xs={12} md={12} title={"B2B"} icon={<WorkIcon/>} iconColor={"indigo"}>*/}
                {/*    <ModelB2BComponent productModel={productModel} setProductModel={setProductModel}*/}
                {/*                       props={{...props}}/>*/}
                {/*</IconGrid>*/}
                {/*/!*<IconGrid xs={12} md={12} title={"Allegro"} icon={<Palette/>} iconColor={"green"}>*!/*/}
                {/*/!*    <TextEditorAllegro/>*!/*/}
                {/*/!*</IconGrid>*!/*/}

                {/*<IconGrid xs={12} md={12} title={"Zdjęcia"} icon={<PhotoSizeSelectActualIcon/>}*/}
                {/*          iconColor={"cyan"}>*/}
                {/*    <ImagesComponent {...props}/>*/}
                {/*</IconGrid>*/}

                {/*/!*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*!/*/}
                {/*/!*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*!/*/}
            </Grid>

        </UserLayout>
    );
}

