import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {step1} from "./FormSchema";

export const useImportItemsStep1Form = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        clearErrors
    } = useForm({resolver: yupResolver(step1)})

    return {register, handleSubmit, errors, setValue, clearErrors}
}
