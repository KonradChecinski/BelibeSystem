import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import schema
    from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditTasksDialog/form/clientTasksDialogFormSchema";

export const useClientTasksDialogForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        clearErrors
    } = useForm({resolver: yupResolver(schema)})

    return {register, handleSubmit, errors, setValue, clearErrors}
}
