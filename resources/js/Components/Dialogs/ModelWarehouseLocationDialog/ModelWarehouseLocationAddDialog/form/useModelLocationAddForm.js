import {useForm} from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup";
import schema from './modelLocationAddFormSchema'

export const useModelLocationAddForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        clearErrors
    } = useForm({resolver: yupResolver(schema)})

    return {register, handleSubmit, errors, setValue, clearErrors}
}
