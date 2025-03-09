import {
    Autocomplete,
    Box,
    Card,
    CardContent, Checkbox, Divider,
    Fade,
    FormControl, FormControlLabel,
    IconButton, InputLabel, MenuItem, Paper, Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useEffect, useState} from "react";
import {useBasicInfoForm} from "@/Components/Pages/Partners/BasicInfoComponent/form/useBasicInfoForm";
import {useForm} from "@inertiajs/react";
import {enqueueSnackbar} from "notistack";
import {Cancel, Save} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";

export default function BasicInfoComponent({partner, subiektCategories, subiektWarehouses}) {
    const [edited, setEdited] = useState(false);

    const {
        register,
        handleSubmit,
        errors,
        setValue,
        clearErrors,
        getValues
    } = useBasicInfoForm()

    const {data, setData, processing, patch} = useForm({
        'name': partner.name,
        'warehouse_id': partner.warehouse_id,
        'subiekt_category_id': partner.subiekt_category_id,
    })

    const initializeFieldValues = () => {
        setValue('name', data.name)
        setValue('warehouse_id', data.warehouse_id)
        setValue('subiekt_category_id', data.subiekt_category_id)
    }

    useEffect(() => {
        // inicjacja wartości pól
        initializeFieldValues()
    }, [setValue]);

    const onSubmit = (formData) => {
        saveBasic()
    }

    const resetForm = () => {
        setData({
            'name': partner.name,
            'warehouse_id': partner.warehouse_id,
            'subiekt_category_id': partner.subiekt_category_id,
        });

        initializeFieldValues()
        setEdited(false);

        clearErrors('name')
        clearErrors('warehouse_id')
        clearErrors('subiekt_category_id')
    };
    const saveBasic = () => {
        patch(route("system.partners.partner.update", {partner: partner.id}), {
            onSuccess: params => {
                setEdited(false);
                enqueueSnackbar("Zapisano partnera", {variant: 'success'})
            },
            onError: params => {
                console.error(params)
                enqueueSnackbar("Błąd przy zapisywaniu partnera", {variant: 'error'})
            },
            preserveScroll: true
        })
    }

    return (
        <Card sx={{flex: 1, p: 1, position: "relative"}}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <Box sx={{display: "flex", flexDirection: "column", gap: 2, pt: 1}}>

                    <Typography
                        sx={{mb: 1, display: "flex", gap: 1, alignItems: "center"}}>
                        <HomeIcon fontSize={"large"}/>
                        Podstawowe informacje
                    </Typography>
                    <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                        <Box>
                            <TextField
                                type="text"
                                id="name"
                                label="Nazwa"
                                color={errors.name?.message && "error"}
                                {...register("name")}
                                defaultValue={data.name}
                                sx={{width: "30ch", my: 1}}
                                onChange={(value) => {
                                    setData("name", value.target.value,)
                                    setEdited(true)
                                    setValue("name", value.target.value, {shouldValidate: true})
                                }}
                            />
                            {errors.name?.message && (
                                <Typography variant="body2" color="error" sx={{ml: 1}}>
                                    {errors.name?.message.toString()}
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <TextField
                                type="text"
                                id="client"
                                label="Klient"
                                sx={{width: "80ch", my: 1}}
                                disabled={true}
                                value={partner.client.name + " (" + partner.client.nip + ") (id:" + partner.client.id + ")"}
                            />
                        </Box>
                    </Box>


                    <Box>
                        <FormControl sx={{width: "30ch", my: 1}} variant={"outlined"}>
                            <InputLabel id="category-id-label">Kategoria dokumentu</InputLabel>
                            <Select
                                labelId="category-id-label"
                                id="category-id"
                                label="Kategoria dokumentu"
                                color={errors.subiekt_category_id?.message && "error"}
                                {...register("subiekt_category_id")}
                                onChange={(value) => {
                                    setData("subiekt_category_id", value.target.value)
                                    setEdited(true)
                                    setValue("subiekt_category_id", value.target.value, {shouldValidate: true})
                                }}
                                value={data.subiekt_category_id}

                            >
                                {subiektCategories.sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
                                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {errors.subiekt_category_id?.message && (
                            <Typography variant="body2" color="error" sx={{ml: 1}}>
                                {errors.subiekt_category_id?.message.toString()}
                            </Typography>
                        )}

                    </Box>

                    <Box>
                        <FormControl sx={{width: "30ch", my: 1}} variant={"outlined"}>
                            <InputLabel id="warehouse-id-label">Magazyn dokumentów</InputLabel>
                            <Select
                                labelId="warehouse-id-label"
                                id="warehouse-id"
                                label="Magazyn dokumentów"
                                color={errors.warehouse_id?.message && "error"}
                                {...register("warehouse_id")}
                                onChange={(value) => {
                                    setData("warehouse_id", value.target.value)
                                    setEdited(true)
                                    setValue("warehouse_id", value.target.value, {shouldValidate: true})
                                }}
                                value={data.warehouse_id}
                            >
                                {subiektWarehouses.sort((a, b) => a.name.localeCompare(b.name)).map((warehouse) => (
                                    <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {errors.warehouse_id?.message && (
                            <Typography variant="body2" color="error" sx={{ml: 1}}>
                                {errors.warehouse_id?.message.toString()}
                            </Typography>
                        )}

                    </Box>

                    <Fade in={edited}>
                        <Tooltip title={"Zapisz"}>
                            <IconButton
                                type="submit"
                                color="success"
                                size={"small"}
                                disabled={processing}
                                sx={{
                                    position: "absolute",
                                    top: 7,
                                    right: 20,
                                }}>
                                <Save fontSize={"large"}/>
                            </IconButton>
                        </Tooltip>

                    </Fade>
                    <Fade in={edited}>
                        <Tooltip title={"Cofnij zmiany"}>
                            <IconButton
                                color="error"
                                size={"small"}
                                disabled={processing}
                                onClick={resetForm}
                                sx={{
                                    position: "absolute",
                                    top: 7,
                                    right: 70,
                                }}
                            >
                                <Cancel fontSize={"large"}/>
                            </IconButton>
                        </Tooltip>
                    </Fade>

                </Box>
            </form>
        </Card>
    );
}
