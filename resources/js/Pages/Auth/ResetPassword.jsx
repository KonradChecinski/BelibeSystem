import {useEffect, useState} from 'react';
import BeforeLoginLayout from '@/Layouts/BeforeLoginLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import {Head, useForm} from '@inertiajs/react';
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    Box, Button,
    createTheme,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    TextField,
    ThemeProvider, Typography
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {darkTheme} from "@/Theme/Theme";
import {plPL} from "@mui/material/locale";

export default function ResetPassword({token, email, backgroundImage}) {
    const {t} = useLaravelReactI18n()

    const {data, setData, post, processing, errors, reset} = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'));
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleClickShowPasswordConfirmation = () => setShowPasswordConfirmation((show) => !show);

    const handleMouseDownPasswordConfirmation = (event) => {
        event.preventDefault();
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
            <Head title={t("Reset Password")}/>

            <ThemeProvider theme={theme}>
                <Box component={"form"} onSubmit={submit} sx={{
                    width: 1,
                }}>

                    <Box>
                        <TextField
                            id="email"
                            name="email"
                            type="email"
                            label={t("Email")}
                            error={Boolean(errors.email)}
                            autoComplete="username"
                            value={data.email}
                            onChange={onHandleChange}
                            autoFocus={true}
                            color="primary"

                            sx={{
                                mt: 2,
                                width: 1,
                            }}
                        />

                        <Typography variant="body1" color={"error"} sx={{ml: 1, mt: 1}}>
                            {errors.email}
                        </Typography>
                    </Box>


                    <Box>
                        <TextField
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label={t("Password")}
                            error={Boolean(errors.password)}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={onHandleChange}
                            color="primary"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}

                            sx={{
                                mt: 2,
                                width: 1,
                            }}

                        />

                        <Typography variant="body1" color={"error"} sx={{ml: 1, mt: 1}}>
                            {errors.password}
                        </Typography>
                    </Box>


                    <Box>
                        <TextField
                            id="password_confirmation"
                            name="password_confirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            label={t("Confirm Password")}
                            error={Boolean(errors.password_confirmation)}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={onHandleChange}
                            color="primary"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPasswordConfirmation}
                                            onMouseDown={handleMouseDownPasswordConfirmation}
                                        >
                                            {showPasswordConfirmation ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}

                            sx={{
                                mt: 2,
                                width: 1,
                            }}

                        />

                        <Typography variant="body1" color={"error"} sx={{ml: 1, mt: 1}}>
                            {errors.password_confirmation}
                        </Typography>
                    </Box>


                    <Box sx={{display: "flex", width: 1}}>
                        <Button variant="contained" sx={{mt: 2, width: 1}} disabled={processing} type={"submit"}>
                            <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                {t("Reset Password")}
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            </ThemeProvider>
        </BeforeLoginLayout>
    );
}
