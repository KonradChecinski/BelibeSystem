import {useEffect, useState} from 'react';
import Checkbox from '@/Components/Checkbox';
import BeforeLoginLayout from '@/Layouts/BeforeLoginLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import {Head, Link, useForm} from '@inertiajs/react';

import {useLaravelReactI18n} from 'laravel-react-i18n'
import {FormControl, IconButton, Input, InputAdornment, OutlinedInput, TextField} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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

    return (
        <BeforeLoginLayout background={backgroundImage}>
            <Head title={t("Log in")}/>

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit} className="guest">
                <div>
                    <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                        <InputLabel htmlFor="email" className="ml-2 text-white">{t("Email")}</InputLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            error={errors.email}
                            inputProps={{className: "text-white"}}
                            autoComplete="username"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoFocus
                            onChange={handleOnChange}
                            sx={{color: 'white', px: 1}}
                        />
                    </FormControl>

                    <InputError message={errors.email} className="mt-2 ml-2"/>
                </div>

                <div className="mt-8">
                    <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                        <InputLabel htmlFor="password" className="ml-2 text-white">{t("Password")}</InputLabel>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            error={errors.password}
                            inputProps={{className: "text-white"}}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={handleOnChange}
                            sx={{color: 'white', px: 1}}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        className="text-white"
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <InputError message={errors.password} className="mt-2 ml-2"/>
                </div>

                <div className="flex items-center justify-between mt-8">
                    <label className="flex items-center">
                        <Checkbox name="remember" value={data.remember} onChange={handleOnChange}/>
                        <span className="ml-2 text-sm text-white dark:text-gray-400">{t("Remember me")}</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route(routePasswordRequest)}
                            className="underline text-sm text-white dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                            {t("Forgot your password?")}
                        </Link>
                    )}
                </div>

                <div className="flex items-center justify-end mt-8">
                    <PrimaryButton className="w-full flex justify-center " disabled={processing}>
                        {t("Log in")}
                    </PrimaryButton>
                </div>

                <div className="flex items-center justify-center mt-4">
                    {canRegister && (
                        <Link
                            href={route(routeRegister)}
                            // href=""
                            className="underline text-sm text-white dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                            {t("Register")}
                        </Link>
                    )}
                </div>
            </form>
        </BeforeLoginLayout>
    );
}
