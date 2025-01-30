import BeforeLoginLayout from '@/Layouts/BeforeLoginLayout';
import {Head, useForm} from '@inertiajs/react';
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box,
    Button,
    createTheme,
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
                <Typography variant="body1" gutterBottom
                            sx={{
                                color: "success.main",
                                fontWeight: 700,
                                fontSize: "0.85rem"
                            }}>
                    {status}
                </Typography>
            )}

            <Box component={"form"} onSubmit={submit} sx={{
                width: 1,
            }}>

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


            </Box>
        </BeforeLoginLayout>
    );
}
