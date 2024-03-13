import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Box, Container, Divider, Grid, Paper, Stack, Typography} from "@mui/material";
import IconGrid from "@/Components/Layout/IconGrid";
import InfoIcon from '@mui/icons-material/Info';
import BasicClientInfoComponent from "@/Components/Pages/Client/BasicClientInfoComponent";
import AdditionalClientInfoComponent from "@/Components/Pages/Client/AdditionalClientInfoComponent";
import AddBoxIcon from '@mui/icons-material/AddBox';
import NotesClientComponent from "@/Components/Pages/Client/ClientNotesComponent";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ClientActivityComponent from "@/Components/Pages/Client/ClientActivityComponent";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ClientDiscountsComponent from "@/Components/Pages/Client/ClientDiscountsComponent";
import DiscountIcon from '@mui/icons-material/Discount';
import TaskIcon from "@mui/icons-material/Task";
import ClientTasksComponent from "@/Components/Pages/Client/ClientTasksComponent";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import ClientLocationsComponent from "@/Components/Pages/Client/ClientLocationsComponent";
import ClientOrderHistoryComponent from "@/Components/Pages/Client/ClientOrderHistoryComponent";
import {PointOfSale, Savings} from "@mui/icons-material";
import ClientSettlementsTable from "@/Components/Table/ClientSettlementsTable";
import ClientInvoicesComponent from "@/Components/Pages/Client/ClientInvoicesComponent";


export default function Client(props) {

    // const [productModel, setProductModel] = useState({
    //     ...props.productModel,
    //     categories: props.productModel.categories.map((value) => {
    //         // delete value.pivot;
    //         return value.id;
    //     })
    // });
    console.log("Propsy: ", props);


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={"Klient: " + props.client.name}>
            <Head title={props.client.name}/>

            <Grid container spacing={3} sx={{pb: 1}}>
                <Grid item xs={12} md={12} lg={8}>
                    <Grid container spacing={3}>
                        <IconGrid xs={12} md={12} lg={12} xl={8} title={"Informacje podstawowe"} icon={<InfoIcon/>}
                                  iconColor={"darkblue"}>
                            <BasicClientInfoComponent {...props}/>
                        </IconGrid>

                        <IconGrid xs={12} md={12} lg={12} xl={4} title={"Informacje dodatkowe"} icon={<AddBoxIcon/>}
                                  iconColor={"green"}>
                            <AdditionalClientInfoComponent {...props} />
                        </IconGrid>

                        <IconGrid xs={12} md={12} lg={12} title={"Rabaty klienta"} icon={<DiscountIcon/>}
                                  iconColor={"green"}>
                            <ClientDiscountsComponent {...props} />
                        </IconGrid>

                    </Grid>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Grid container spacing={3}>
                        <IconGrid xs={12} md={12} title={"Notatki"} icon={<NoteAddIcon/>} iconColor={"magenta"}>
                            <NotesClientComponent {...props} />
                        </IconGrid>

                        <IconGrid xs={12} md={12} title={"Zadania"} icon={<TaskIcon/>} iconColor={"indigo"}>
                            <ClientTasksComponent {...props} />
                        </IconGrid>

                        <IconGrid xs={12} md={12} title={"Aktywności"} icon={<EventAvailableIcon/>}
                                  iconColor={"darkcyan"}>
                            <ClientActivityComponent {...props} />
                        </IconGrid>

                        <IconGrid xs={12} lg={12} title={"Punkty klienta"} icon={<LocationOnIcon/>} iconColor={"blue"}>
                            <ClientLocationsComponent {...props} />
                        </IconGrid>
                    </Grid>
                </Grid>
            </Grid>


            <Grid container spacing={3} sx={{pb: 1}}>

                {/*To dopiero jak będą zamówienia*/}
                {/*<IconGrid xs={12} md={12} title={"Historia zamówień klienta"} icon={<HistoryIcon/>}*/}
                {/*          iconColor={"darkcyan"}>*/}
                {/*    <ClientOrderHistoryComponent {...props} />*/}
                {/*</IconGrid>*/}

                {/*<IconGrid xs={12} md={12} title={"Faktury klienta"} icon={<DescriptionIcon/>} iconColor={"magenta"}>*/}
                {/*    <ClientInvoicesComponent {...props} />*/}
                {/*</IconGrid>*/}

                <IconGrid xs={12} md={12} title={"Rozliczenia klienta"} icon={<PaymentIcon/>} iconColor={"magenta"}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={6}>
                            <Paper elevation={2}>
                                <Typography
                                    sx={{p: 1, display: "flex", gap: 1, alignItems: "center"}}>
                                    <PointOfSale fontSize={"large"}/>
                                    Należności
                                </Typography>
                                <ClientSettlementsTable settlement={props.client.receivables} readOnly={!props.editing}
                                                        props={props}/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Paper elevation={2}>
                                <Typography
                                    sx={{p: 1, display: "flex", gap: 1, alignItems: "center"}}>
                                    <Savings fontSize={"large"}/>
                                    Zobowiązania
                                </Typography>
                                <ClientSettlementsTable settlement={props.client.obligations} readOnly={!props.editing}
                                                        props={props}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </IconGrid>


                {/*To dopiero jak będą zamówienia*/}
                {/*<IconGrid xs={12} md={12} title={"Użytkownicy klienta"} icon={<PeopleAltIcon/>} iconColor={"gray"}>*/}
                {/*    <ClientUsersComponent {...props} />*/}
                {/*</IconGrid>*/}


            </Grid>

        </UserLayout>
    );
}

