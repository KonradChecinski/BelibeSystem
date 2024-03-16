import {useEffect, useState} from 'react';
import GuestLayout from '@/Layouts/BeforeLoginLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import {Head, Link, useForm} from '@inertiajs/react';
import {useLaravelReactI18n} from "laravel-react-i18n";
import {FormControl, IconButton, Input, InputAdornment} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

export default function Register({routeLogin, routeRegister, backgroundImage}) {
    const {t} = useLaravelReactI18n()

    const {data, setData, post, processing, errors, reset} = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route(routeRegister));
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
        <GuestLayout background={backgroundImage}>
            <Head title={t("Register")}/>

            <form onSubmit={submit} className="guest">
                <div>
                    {/*<InputLabel htmlFor="name" value={ t("Name") } />*/}

                    {/*<TextInput*/}
                    {/*    id="name"*/}
                    {/*    name="name"*/}
                    {/*    value={data.name}*/}
                    {/*    className="mt-1 block w-full"*/}
                    {/*    autoComplete="name"*/}
                    {/*    isFocused={true}*/}
                    {/*    onChange={handleOnChange}*/}
                    {/*    required*/}
                    {/*/>*/}
                    <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                        <InputLabel htmlFor="email" className="ml-2 font-bold">{t("Name")}</InputLabel>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            error={errors.name ? 'error' : ''}
                            inputProps={{className: "text-white-50"}}
                            autoComplete="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={handleOnChange}
                            sx={{color: 'white', px: 1}}
                            required
                        />
                    </FormControl>

                    <InputError message={errors.name} className="mt-2"/>
                </div>

                <div className="mt-8">
                    <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                        <InputLabel htmlFor="email" className="ml-2 font-bold">{t("Email")}</InputLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            error={errors.email ? 'error' : ''}
                            inputProps={{className: "text-white-50"}}
                            autoComplete="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            onChange={handleOnChange}
                            sx={{color: 'white', px: 1}}
                            required
                        />
                    </FormControl>

                    <InputError message={errors.email} className="mt-2 ml-2"/>
                </div>

                <div className="mt-8">
                    {/*<InputLabel htmlFor="password" value={ t("Password") } />*/}

                    {/*<TextInput*/}
                    {/*    id="password"*/}
                    {/*    type="password"*/}
                    {/*    name="password"*/}
                    {/*    value={data.password}*/}
                    {/*    className="mt-1 block w-full"*/}
                    {/*    autoComplete="new-password"*/}
                    {/*    onChange={handleOnChange}*/}
                    {/*    required*/}
                    {/*/>*/}

                    <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                        <InputLabel htmlFor="password" className="ml-2">{t("Password")}</InputLabel>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            error={errors.password ? 'error' : ''}
                            inputProps={{className: "text-white-50"}}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={handleOnChange}
                            sx={{color: 'white', px: 1}}
                            required
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

                    <InputError message={errors.password} className="mt-2"/>
                </div>

                <div className="mt-8">
                    {/*<InputLabel htmlFor="password_confirmation" value={ t("Confirm Password") } />*/}

                    {/*<TextInput*/}
                    {/*    id="password_confirmation"*/}
                    {/*    type="password"*/}
                    {/*    name="password_confirmation"*/}
                    {/*    value={data.password_confirmation}*/}
                    {/*    className="mt-1 block w-full"*/}
                    {/*    autoComplete="new-password"*/}
                    {/*    onChange={handleOnChange}*/}
                    {/*    required*/}
                    {/*/>*/}

                    <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                        <InputLabel htmlFor="password" className="ml-2">{t("Confirm Password")}</InputLabel>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            error={errors.password_confirmation ? 'error' : ''}
                            inputProps={{className: "text-white-50"}}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={handleOnChange}
                            sx={{color: 'white', px: 1}}
                            required
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        className="text-white"
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPasswordConfirmation}
                                        onMouseDown={handleMouseDownPasswordConfirmation}
                                    >
                                        {showPasswordConfirmation ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <InputError message={errors.password_confirmation} className="mt-2"/>
                </div>

                <div className="flex items-center justify-end mt-8">
                    <PrimaryButton className="w-full flex justify-center" disabled={processing}>
                        {t("Register")}
                    </PrimaryButton>
                </div>

                <div className="flex items-center justify-center mt-4">

                    <Link
                        href={route(routeLogin)}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        {t("Already registered?")}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
