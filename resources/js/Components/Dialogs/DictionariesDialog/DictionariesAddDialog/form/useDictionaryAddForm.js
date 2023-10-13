import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'

export const useDictionaryAddForm = (schema) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        clearErrors
    } = useForm({resolver: yupResolver(schema)})

    return {register, handleSubmit, errors, setValue, clearErrors}
}
