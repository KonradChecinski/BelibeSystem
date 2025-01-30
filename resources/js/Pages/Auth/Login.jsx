import {useEffect, useState} from 'react';
import BeforeLoginLayout from '@/Layouts/BeforeLoginLayout';
import {Head, Link, useForm} from '@inertiajs/react';
import {useLaravelReactI18n} from 'laravel-react-i18n'
import {
    Box, Button, Checkbox,
    createTheme,
    FormControlLabel, FormGroup,
    IconButton,
    InputAdornment,
    TextField,
    ThemeProvider, Typography
} from "@mui/material";
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {darkTheme} from "@/Theme/Theme";
import {plPL} from "@mui/material/locale";

export default function Login({
                                  status,
                                  canResetPassword,
                                  canRegister,
                                  backgroundImage,
                                  routeLogin,
                                  routePasswordRequest,
                                  routeRegister
                              }) {
    const {t} = useLaravelReactI18n()


    const {data, setData, post, processing, errors, reset} = useForm({
        email: '',
        password: '',
        remember: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route(routeLogin));
    };


    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
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
            <Head title={t("Log in")}/>

            <ThemeProvider theme={theme}>
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
                    <Box>
                        <TextField
                            id="email"
                            name="email"
                            type="email"
                            label={t("Email")}
                            error={Boolean(errors.email)}
                            autoComplete="username"
                            value={data.email}
                            onChange={handleOnChange}
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
                            autoComplete="current-password"
                            value={data.password}
                            onChange={handleOnChange}
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

                    <div className="flex items-center justify-between mt-8">

                        <Box>

                            <FormGroup>
                                <FormControlLabel
                                    name="remember"
                                    control={
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={handleOnChange}
                                            color="primary"
                                            size={"medium"}
                                        />

                                    }
                                    label={t("Remember me")}
                                    sx={{
                                        "& .MuiFormControlLabel-label": {
                                            fontSize: "0.85rem"
                                        }
                                    }}
                                />
                            </FormGroup>
                        </Box>

                        {canResetPassword && (
                            <Button
                                component={Link}
                                variant="text"
                                href={route(routePasswordRequest)}
                                sx={{fontSize: "0.85rem", textTransform: "none"}}
                            >
                                {t("Forgot your password?")}
                            </Button>
                        )}

                    </div>

                    <Box sx={{display: "flex", width: 1}}>
                        <Button variant="contained" sx={{mt: 2, width: 1}} disabled={processing} type={"submit"}>
                            <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                {t("Log in")}
                            </Typography>
                        </Button>
                    </Box>

                    
                    <Box>
                        {canRegister && (
                            <Button
                                component={Link}
                                variant="text"
                                href={route(routeRegister)}
                                sx={{mt: 2, width: 1}}
                            >
                                {t("Register")}
                            </Button>
                        )}
                    </Box>

                </Box>
            </ThemeProvider>
        </BeforeLoginLayout>
    );
}
