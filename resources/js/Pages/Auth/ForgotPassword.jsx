import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import {useLaravelReactI18n} from "laravel-react-i18n";
import InputLabel from "@/Components/InputLabel";
import {FormControl, IconButton, Input, InputAdornment} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

export default function ForgotPassword({ status }) {
    const { t } = useLaravelReactI18n()

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title={ t("Forgot Password") } />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                { t("Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.") }
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">{status}</div>}

            <form onSubmit={submit} className="guest">
                <FormControl className="w-full autofill:bg-none px-2" variant="standard">
                    <InputLabel htmlFor="email" className="ml-2">{ t("Email") }</InputLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        error={ errors.email? 'error': ''}
                        inputProps={{ className: "text-white-50" }}
                        autoComplete="new-password"
                        value={data.email}
                        onChange={onHandleChange}
                        isFocused={true}
                        sx={{color: 'white', px: 1}}
                    />
                </FormControl>

                <InputError message={errors.email} className="mt-2 ml-2" />

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        { t("Email Password Reset Link") }
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
