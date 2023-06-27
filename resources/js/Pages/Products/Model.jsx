import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import NavLink from "@/Components/NavLink";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent, FormControl,
    Grid,
    InputLabel, MenuItem,
    Paper, Select,
    TextField,
    Typography
} from "@mui/material";
import { useSnackbar } from "notistack";
import ModelsTable from "@/Components/Table/ModelsTable";
import { Category, Palette } from "@mui/icons-material";
import IconGrid from "@/Components/IconGrid";

export default function Model(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    console.log(props);
    return (

        <UserLayout auth={props.auth} errors={props.errors} header={"Model: " + props.productModel.name}>
            <Head title="Dashboard" />
            <Grid container spacing={2}>
                <IconGrid xs={12} md={12} title={"Podstawowe informacje"} icon={<Palette />} iconColor={"green"}>
                    <Box sx={{ display: "flex", gap: 10, mt: 2 }}>
                        <Box>


                            {/*<Typography variant="h5" gutterBottom component="h2">*/}
                            {/*    Symbol*/}
                            {/*</Typography>*/}
                            <TextField id="symbol" label="Symbol" variant="outlined"
                                       value={props.productModel.symbol}
                                       disabled={!props.editing}
                                       sx={{ width: "30ch" }} />

                        </Box>
                        <Box>


                            {/*<Typography variant="h5" gutterBottom component="h2">*/}
                            {/*    Nazwa*/}
                            {/*</Typography>*/}
                            <TextField id="name" label="Nazwa" variant="outlined"
                                       value={props.productModel.name}
                                       disabled={!props.editing}
                                       sx={{ width: "30ch" }} />

                        </Box>
                        <Box>


                            {/*<Typography variant="h5" gutterBottom component="h2">*/}
                            {/*    Grupa*/}
                            {/*</Typography>*/}
                            <FormControl sx={{ width: "30ch" }}>
                                <InputLabel id="group-select-label">Grupa</InputLabel>
                                <Select
                                    labelId="group-select-label"
                                    id="group-select"
                                    label="Grupa"
                                    value={props.productModel.product_group_id}
                                    onChange={() => {
                                        return true;
                                    }}
                                    disabled={!props.editing}
                                >
                                    {props.groups.map((group) => {
                                        return (
                                            <MenuItem value={group.id}>
                                                {group.name}
                                            </MenuItem>
                                        );
                                    })}

                                </Select>

                            </FormControl>


                        </Box>
                    </Box>

                </IconGrid>
                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
                {/*<IconGrid xs={12} md={12} icon={<Palette />} iconColor={"green"} />*/}
                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
                {/*<IconGrid xs={6} md={6} icon={<Category />} iconColor={"blue"} />*/}
            </Grid>


            <Paper>
                {/*<ModelsTable {...props} />*/}
            </Paper>
        </UserLayout>
    );
}
