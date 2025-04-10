import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {step3} from "./FormSchema";

export const useImportItemsStep3Form = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        clearErrors
    } = useForm({resolver: yupResolver(step3)})

    return {register, handleSubmit, errors, setValue, clearErrors}
}
