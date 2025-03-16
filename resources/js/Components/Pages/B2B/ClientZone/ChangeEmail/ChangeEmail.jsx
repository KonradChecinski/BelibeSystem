import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Box, Button, Divider, Paper, TextField, Typography} from "@mui/material";
import {useChangeEmailForm} from "@/Components/Pages/B2B/ClientZone/ChangeEmail/form/useChangeEmailForm";
import {useForm} from "@inertiajs/react";
import moment from "moment";

export default function ChangeEmail(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();

    const {
        register,
        handleSubmit,
        errors,
        setValue,
        clearErrors,
        control
    } = useChangeEmailForm()

    const {data, setData, post, processing, reset} = useForm({
        email: '',
        confirmEmail: '',
    })
    const onSubmit = (data) => {
        console.log(data)
        // setData(data)
        // setActiveStep(activeStep + 1)
    }

    return (
        <Paper sx={{height: 1, p: 2}}>
            <Typography variant="h5" gutterBottom component="h5">
                {t("Change email address")}
            </Typography>
            <Box
                sx={{
                    width: 1,
                    // height: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 2
                }}>
                <Box sx={{width: 1}}>
                    <TextField
                        type="text"
                        id="email"
                        label={t("Current email address")}
                        value={props.auth.user.email}
                        sx={{width: 1, my: 1}}
                        disabled={true}
                    />

                </Box>
                <Divider flexItem/>

                <Box component={"form"} onSubmit={handleSubmit(onSubmit)} autoComplete="off"
                     sx={{
                         width: 1,
                         display: "flex",
                         flexDirection: "column",
                         justifyContent: "center",
                         alignItems: "center",
                         gap: 2
                     }}>
                    <Box sx={{width: 1}}>

                        <TextField
                            type="text"
                            id="email"
                            label={t("New email address")}
                            color={errors.email?.message && "error"}
                            {...register("email")}
                            onChange={(value) => {
                                setData('email', value.target.value);
                            }}
                            value={data.email}
                            sx={{width: 1, my: 1}}
                        />
                        {errors.email?.message && (
                            <Typography variant="body2" color="error" sx={{ml: 1}}>
                                {errors.email?.message.toString()}
                            </Typography>
                        )}

                    </Box>

                    <Box sx={{width: 1}}>

                        <TextField
                            type="text"
                            id="confirmEmail"
                            label={t("Confirm new email address")}
                            color={errors.confirmEmail?.message && "error"}
                            {...register("confirmEmail")}
                            onChange={(value) => {
                                setData('confirmEmail', value.target.value);
                            }}
                            defaultValue={data.confirmEmail}
                            sx={{width: 1, my: 1}}
                        />
                        {errors.confirmEmail?.message && (
                            <Typography variant="body2" color="error" sx={{ml: 1}}>
                                {errors.confirmEmail?.message.toString()}
                            </Typography>
                        )}

                    </Box>
                    <Box>
                        <Typography variant="body2" color="info" sx={{ml: 1}}>
                            {t("After changing the email address, you will need to confirm the new address by clicking the link sent to the new address.")}
                        </Typography>
                    </Box>
                    <Box sx={{width: 1, display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                        <Button variant="contained" sx={{my: 2}} type="submit">
                            {t("Change email address")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    )
}
