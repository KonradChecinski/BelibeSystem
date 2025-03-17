import {useSnackbar} from "notistack";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    FormControl, IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {useForm} from "@inertiajs/react";
import {useChangePasswordForm} from "@/Components/Pages/B2B/ClientZone/ChangePassword/form/useChangePasswordForm";
import {useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function ChangePassword(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {t} = useLaravelReactI18n();

    const {
        register,
        handleSubmit,
        errors,
        setValue,
        clearErrors,
        control
    } = useChangePasswordForm()

    const {data, setData, post, processing, errors: errorsData} = useForm({
        password: '',
        password_confirmation: '',
    })
    const onSubmit = (data) => {
        console.log(data)
        save()
    }


    const save = () => {
        post(route("b2b.client.password.change"),
            {
                preserveScroll: true,
                onSuccess: () => {
                    enqueueSnackbar("Zmieniono hasło", {variant: 'success'})
                },
                onError: errors => {
                    console.error(errors)
                    enqueueSnackbar("Błąd przy zmianie hasła", {variant: 'error'})
                    for (const errorsKey in errors) {
                        enqueueSnackbar(errors[errorsKey], {variant: 'error'})
                    }

                },
            })
    }


    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Paper sx={{height: 1, p: 2}}>

            <Typography variant="h5" gutterBottom component="h5">
                {t("Change password")}
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
                        <FormControl sx={{width: 1, my: 1}} variant="outlined">
                            <InputLabel htmlFor="password">{t("New password")}</InputLabel>
                            <OutlinedInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                            disabled={props.accountManager}
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label={t("New password")}
                                color={errors.password?.message && "error"}
                                {...register("password")}
                                onChange={(value) => {
                                    setData('password', value.target.value);
                                }}
                                value={data.password}
                                disabled={props.accountManager}

                            />
                        </FormControl>

                        {errors.password?.message && (
                            <Typography variant="body2" color="error" sx={{ml: 1}}>
                                {errors.password?.message.toString()}
                            </Typography>
                        )}

                    </Box>
                    <Box sx={{width: 1}}>


                        <FormControl sx={{width: 1, my: 1}} variant="outlined">
                            <InputLabel htmlFor="password_confirmation">{t("Confirm new password")}</InputLabel>
                            <OutlinedInput
                                id="password_confirmation"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                            disabled={props.accountManager}
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label={t("Confirm new password")}
                                color={errors.password_confirmation?.message && "error"}
                                {...register("password_confirmation")}
                                onChange={(value) => {
                                    setData('password_confirmation', value.target.value);
                                }}
                                value={data.password_confirmation}
                                disabled={props.accountManager}

                            />
                        </FormControl>
                        {errors.password_confirmation?.message && (
                            <Typography variant="body2" color="error" sx={{ml: 1}}>
                                {errors.password_confirmation?.message.toString()}
                            </Typography>
                        )}

                    </Box>
                    <Box>
                        {Object.keys(errorsData).map((key) => (
                            <Typography variant="body2" color="error" sx={{ml: 1}}>
                                {errorsData[key]}
                            </Typography>
                        ))}
                    </Box>
                    <Box>
                        <Typography variant="body2" color="info" sx={{ml: 1}}>
                            {t("After changing the password, you will need to log in again.")}
                        </Typography>
                    </Box>
                    <Box sx={{width: 1, display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                        <Button variant="contained" sx={{my: 2}} type={"submit"}
                                disabled={processing || props.accountManager}>
                            {t("Change password")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    )
}
