import BeforeLoginLayout from '@/Layouts/BeforeLoginLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import {Head, useForm} from '@inertiajs/react';
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    createTheme,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    TextField, ThemeProvider,
    Typography
} from "@mui/material";
import {plPL} from "@mui/material/locale";
import {darkTheme} from "@/Theme/Theme";

export default function ForgotPassword({status, routePasswordEmail, backgroundImage}) {
    const {t} = useLaravelReactI18n()

    const {data, setData, post, processing, errors} = useForm({
        email: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route(routePasswordEmail));
    };


    const theme = createTheme({
        palette: {
            mode: "dark",
            ...darkTheme
        },
        typography: {
            fontSize: 11
        },
        shape: {
            borderRadius: 16
        },

    }, plPL)

    return (
        <BeforeLoginLayout background={backgroundImage}>
            <Head title={t("Forgot Password")}/>

            <Typography variant="body1" gutterBottom textAlign={"center"}>
                {t("Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.")}
            </Typography>

            {status && (
                <Typography variant="body1" gutterBottom textAlign={"center"}>
                    {status}
                </Typography>
                // <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400"></div>
            )}

            <form onSubmit={submit}>

                <ThemeProvider theme={theme}>
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        error={Boolean(errors.email)}
                        autoComplete="email"
                        value={data.email}
                        onChange={onHandleChange}
                        autoFocus={true}
                        color="primary"
                        InputProps={{
                            style: {color: '#fff'},
                        }}

                        sx={{
                            mx: 1,
                            mt: 2,
                            width: 1,
                        }}
                    />
                </ThemeProvider>

                <Typography variant="body1" color={"error"} sx={{ml: 1, mt: 1}}>
                    {errors.email}
                </Typography>

                <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                    <Button variant="contained" sx={{my: 2}} disabled={processing} type={"submit"}>
                        {t("Email Password Reset Link")}
                    </Button>
                </Box>

                {/*<FormControl className="w-full autofill:bg-none px-2" variant="standard">*/}
                {/*    <InputLabel htmlFor="email" className="ml-2">{t("Email")}</InputLabel>*/}
                {/*    <Input*/}
                {/*        id="email"*/}
                {/*        name="email"*/}
                {/*        type="email"*/}
                {/*        error={errors.email ? 'error' : ''}*/}
                {/*        inputProps={{className: "text-white-50"}}*/}
                {/*        autoComplete="new-password"*/}
                {/*        value={data.email}*/}
                {/*        onChange={onHandleChange}*/}
                {/*        isFocused={true}*/}
                {/*        sx={{color: 'white', px: 1}}*/}
                {/*    />*/}
                {/*</FormControl>*/}

                {/*<InputError message={errors.email} className="mt-2 ml-2"/>*/}

                {/*<div className="flex items-center justify-end mt-4">*/}
                {/*    <PrimaryButton className="ml-4" disabled={processing}>*/}
                {/*        {t("Email Password Reset Link")}*/}
                {/*    </PrimaryButton>*/}
                {/*</div>*/}


            </form>
        </BeforeLoginLayout>
    );
}
