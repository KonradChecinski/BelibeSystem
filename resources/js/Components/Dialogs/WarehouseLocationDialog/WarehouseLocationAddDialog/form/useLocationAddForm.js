import {useForm} from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup";
import schema from './locationAddFormSchema'

export const useLocationAddForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        clearErrors,
        reset,
    } = useForm({resolver: yupResolver(schema)})

    return {register, handleSubmit, errors, setValue, clearErrors, reset}
}
