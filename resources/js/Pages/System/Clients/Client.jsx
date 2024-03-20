import {Head} from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {Grid, Paper, Typography} from "@mui/material";
import {
    PointOfSale,
    Savings,
    Payment,
    Info,
    LocationOn,
    Task,
    Discount,
    EventAvailable,
    NoteAdd,
    AddBox
} from "@mui/icons-material";

import IconGrid from "@/Components/Layout/IconGrid";
import BasicClientInfoComponent from "@/Components/Pages/Client/BasicClientInfoComponent";
import AdditionalClientInfoComponent from "@/Components/Pages/Client/AdditionalClientInfoComponent";
import NotesClientComponent from "@/Components/Pages/Client/ClientNotesComponent";
import ClientActivityComponent from "@/Components/Pages/Client/ClientActivityComponent";
import ClientDiscountsComponent from "@/Components/Pages/Client/ClientDiscountsComponent";
import ClientTasksComponent from "@/Components/Pages/Client/ClientTasksComponent";
import ClientLocationsComponent from "@/Components/Pages/Client/ClientLocationsComponent";
import ClientSettlementsTable from "@/Components/Table/Client/ClientSettlementsTable";
import ClientOrderHistoryComponent from "@/Components/Pages/Client/ClientOrderHistoryComponent";
import ClientInvoicesComponent from "@/Components/Pages/Client/ClientInvoicesComponent";


export default function Client(props) {
    // console.log("Propsy: ", props);


    return (
        <UserLayout auth={props.auth} errors={props.errors} header={"Klient: " + props.client.name}>
            <Head title={props.client.name}/>

            <Grid container spacing={3} sx={{pb: 1}}>
                <Grid item xs={12} md={12} lg={8}>
                    <Grid container spacing={3}>
                        <IconGrid xs={12} md={12} lg={12} xl={8} title={"Informacje podstawowe"} icon={<Info/>}
                                  iconColor={"darkblue"}>
                            <BasicClientInfoComponent {...props}/>
                        </IconGrid>

                        <IconGrid xs={12} md={12} lg={12} xl={4} title={"Informacje dodatkowe"} icon={<AddBox/>}
                                  iconColor={"green"}>
                            <AdditionalClientInfoComponent {...props} />
                        </IconGrid>

                        <IconGrid xs={12} md={12} lg={12} title={"Rabaty klienta"} icon={<Discount/>}
                                  iconColor={"green"}>
                            <ClientDiscountsComponent {...props} />
                        </IconGrid>

                    </Grid>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Grid container spacing={3}>
                        <IconGrid xs={12} md={12} title={"Notatki"} icon={<NoteAdd/>} iconColor={"magenta"}>
                            <NotesClientComponent {...props} />
                        </IconGrid>

                        <IconGrid xs={12} md={12} title={"Zadania"} icon={<Task/>} iconColor={"indigo"}>
                            <ClientTasksComponent {...props} />
                        </IconGrid>

                        <IconGrid xs={12} md={12} title={"Aktywności"} icon={<EventAvailable/>}
                                  iconColor={"darkcyan"}>
                            <ClientActivityComponent {...props} />
                        </IconGrid>

                        <IconGrid xs={12} lg={12} title={"Punkty klienta"} icon={<LocationOn/>} iconColor={"blue"}>
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

                <IconGrid xs={12} md={12} title={"Rozliczenia klienta"} icon={<Payment/>} iconColor={"magenta"}>
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

