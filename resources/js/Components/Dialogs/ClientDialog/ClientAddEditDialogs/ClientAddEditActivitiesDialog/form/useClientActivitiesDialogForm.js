import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import schema
    from "@/Components/Dialogs/ClientDialog/ClientAddEditDialogs/ClientAddEditActivitiesDialog/form/clientActivitiesDialogFormSchema";

export const useClientActivitiesDialogForm = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        clearErrors,
        control,
    } = useForm({resolver: yupResolver(schema)})

    return {register, handleSubmit, errors, setValue, clearErrors, control}
}
