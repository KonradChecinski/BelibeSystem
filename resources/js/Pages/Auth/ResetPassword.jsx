import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import {useLaravelReactI18n} from "laravel-react-i18n";
import {FormControl, IconButton, Input, InputAdornment} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

export default function ResetPassword({ token, email }) {
    const { t } = useLaravelReactI18n()

    const { data, setData, post, processing, errors, reset } = useForm({
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

    return (
        <GuestLayout>
            <Head title={ t("Reset Password") } />

            <form onSubmit={submit} className="guest">
                <div>
                     <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                        <InputLabel htmlFor="email" className="ml-2 font-bold">{ t("Email") }</InputLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            error={ errors.email? 'error': ''}
                            inputProps={{ className: "text-white-50" }}
                            autoComplete="username"
                            value={data.email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={onHandleChange}
                            sx={{color: 'white', px: 1}}
                        />
                    </FormControl>

                    <InputError message={errors.email} className="mt-2 ml-2" />
                </div>

                <div className="mt-4">
                    <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                        <InputLabel htmlFor="password" className="ml-2">{ t("Password") }</InputLabel>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            error={ errors.password? 'error': ''}
                            inputProps={{ className: "text-white-50" }}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={onHandleChange}
                            sx={{color: 'white', px: 1}}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        className="text-white"
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <InputError message={errors.password} className="mt-2 ml-2" />
                </div>

                <div className="mt-4">

                    <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                        <InputLabel htmlFor="password" className="ml-2">{ t("Confirm Password") }</InputLabel>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            error={ errors.password_confirmation? 'error': ''}
                            inputProps={{ className: "text-white-50" }}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={onHandleChange}
                            sx={{color: 'white', px: 1}}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        className="text-white"
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPasswordConfirmation}
                                        onMouseDown={handleMouseDownPasswordConfirmation}
                                    >
                                        {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <InputError message={errors.password_confirmation} className="mt-2 ml-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        { t("Reset Password") }
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
