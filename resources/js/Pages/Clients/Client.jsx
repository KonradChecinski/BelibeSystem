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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ClientUsersComponent from "@/Components/Pages/Client/ClientUsersComponent";
import ClientActivityComponent from "@/Components/Pages/Client/ClientActivityComponent";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ClientDiscountsComponent from "@/Components/Pages/Client/ClientDiscountsComponent";
import DiscountIcon from '@mui/icons-material/Discount';
import TaskIcon from "@mui/icons-material/Task";
import ClientTasksComponent from "@/Components/Pages/Client/ClientTasksComponent";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClientLocationsComponent from "@/Components/Pages/Client/ClientLocationsComponent";
import ClientOrderHistoryComponent from "@/Components/Pages/Client/ClientOrderHistoryComponent";
import HistoryIcon from '@mui/icons-material/History';


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

                {/*To dopiero jak będą zamówienia*/}
                <IconGrid xs={12} md={12} title={"Użytkownicy klienta"} icon={<PeopleAltIcon/>} iconColor={"gray"}>
                    <ClientUsersComponent {...props} />
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Lokacje klienta"} icon={<LocationOnIcon/>} iconColor={"blue"}>
                    <ClientLocationsComponent {...props} />
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Rabaty klienta"} icon={<DiscountIcon/>} iconColor={"green"}>
                    <ClientDiscountsComponent {...props} />
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Aktywność klienta"} icon={<EventAvailableIcon/>}
                          iconColor={"darkcyan"}>
                    <ClientActivityComponent {...props} />
                </IconGrid>

                {/*To dopiero jak będą zamówienia*/}
                {/*<IconGrid xs={12} md={12} title={"Historia zamówień klienta"} icon={<HistoryIcon/>}*/}
                {/*          iconColor={"darkcyan"}>*/}
                {/*    <ClientOrderHistoryComponent {...props} />*/}
                {/*</IconGrid>*/}

                <IconGrid xs={12} md={12} title={"Zadania klienta"} icon={<TaskIcon/>}
                          iconColor={"indigo"}>
                    <ClientTasksComponent {...props} />
                </IconGrid>

                <IconGrid xs={12} md={12} title={"Notatki do klienta"} icon={<NoteAddIcon/>} iconColor={"magenta"}>
                    <NotesClientComponent {...props} />
                </IconGrid>


            </Grid>

        </UserLayout>
    );
}

