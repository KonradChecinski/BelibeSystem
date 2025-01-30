import BeforeLoginLayout from '@/Layouts/BeforeLoginLayout';
// import PrimaryButton from '@/Components/PrimaryButton';
import {Head, Link, useForm} from '@inertiajs/react';
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Box, Button, createTheme, ThemeProvider, Typography} from "@mui/material";
import {darkTheme} from "@/Theme/Theme";
import {plPL} from "@mui/material/locale";

export default function VerifyEmail({status, backgroundImage}) {
    const {t} = useLaravelReactI18n()

    const {post, processing} = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
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
            <Head title="Email Verification"/>

            <ThemeProvider theme={theme}>
                <Typography variant="body1" gutterBottom textAlign={"center"}>
                    {t("Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.")}
                </Typography>


                {status === 'verification-link-sent' && (
                    <Typography variant="body1" gutterBottom
                                sx={{
                                    color: "success.main",
                                    fontWeight: 700,
                                    fontSize: "0.85rem"
                                }}>
                        {t("A new verification link has been sent to the email address you provided during registration.")}
                    </Typography>
                )}


                <Box component={"form"} onSubmit={submit} sx={{
                    width: 1,
                    mt: 4
                }}>
                    <div className="mt-4 flex items-center justify-between">

                        <Box sx={{display: "flex"}}>
                            <Button variant="contained" disabled={processing} type={"submit"}>
                                <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                    {t("Resend Verification Email")}
                                </Typography>
                            </Button>
                        </Box>
                        

                        <Button
                            component={Link}
                            variant="text"
                            href={route('logout')}
                            method="post"
                            sx={{fontSize: "0.85rem", textTransform: "none"}}
                        >
                            {t("Log Out")}
                        </Button>
                    </div>
                </Box>
            </ThemeProvider>
        </BeforeLoginLayout>
    );
}
