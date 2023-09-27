import * as yup from 'yup'

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    product_group_id: yup
        .string()
        .required("Pole jest wymagane"),
    name_6_char: yup
        .string()
        .required("Pole jest wymagane"),
    name_11_char: yup
        .string()
        .required("Pole jest wymagane"),
})

export default schema
