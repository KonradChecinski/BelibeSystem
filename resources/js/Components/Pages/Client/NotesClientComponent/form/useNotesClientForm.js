import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import schema from "./notesClientFormSchema";

export const useNotesClientForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        clearErrors
    } = useForm({resolver: yupResolver(schema)})

    return {register, handleSubmit, errors, setValue, clearErrors}
}
