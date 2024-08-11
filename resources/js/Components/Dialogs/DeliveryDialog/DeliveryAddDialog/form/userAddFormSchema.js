import * as yup from 'yup'

const addSchema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    description: yup
        .string()
        .required("Pole jest wymagane"),
    subiekt_id: yup
        .number()
        .required("Pole jest wymagane"),
    price_net: yup
        .number()
        .required("Pole jest wymagane"),
    price_gross: yup
        .number()
        .required("Pole jest wymagane"),
    free_from: yup
        .number()
        .required("Pole jest wymagane"),
    active: yup
        .boolean()
        .required("Pole jest wymagane"),
    delivery_time_min: yup
        .number()
        .required("Pole jest wymagane"),
    delivery_time_max: yup
        .number()
        .required("Pole jest wymagane"),
})

const editSchema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    description: yup
        .string()
        .required("Pole jest wymagane"),
    subiekt_id: yup
        .number()
        .required("Pole jest wymagane"),
    price_net: yup
        .number()
        .required("Pole jest wymagane"),
    price_gross: yup
        .number()
        .required("Pole jest wymagane"),
    free_from: yup
        .number()
        .required("Pole jest wymagane"),
    active: yup
        .boolean()
        .required("Pole jest wymagane"),
    delivery_time_min: yup
        .number()
        .required("Pole jest wymagane"),
    delivery_time_max: yup
        .number()
        .required("Pole jest wymagane"),
})

export {addSchema, editSchema}
