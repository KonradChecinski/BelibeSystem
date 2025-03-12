import * as yup from 'yup'

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    warehouse_id: yup
        .number()
        .required("Pole jest wymagane"),
    subiekt_category_id: yup
        .number()
        .required("Pole jest wymagane"),
    b2b_payment_id: yup
        .number()
        .required("Pole jest wymagane"),
})

export default schema
