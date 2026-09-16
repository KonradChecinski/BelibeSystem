import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'

export const useDeliveryAddForm = (schema, defaultValues = {}) => {
    return useForm({
        resolver: yupResolver(schema),
        defaultValues,
        mode: 'onChange',
    })
}
