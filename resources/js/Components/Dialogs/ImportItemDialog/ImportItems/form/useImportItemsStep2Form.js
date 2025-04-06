import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {step2} from "./FormSchema";

export const useImportItemsStep2Form = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        clearErrors
    } = useForm({resolver: yupResolver(step2)})

    return {register, handleSubmit, errors, setValue, clearErrors}
}
