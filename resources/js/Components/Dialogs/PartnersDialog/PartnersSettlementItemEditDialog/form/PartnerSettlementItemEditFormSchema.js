import * as yup from 'yup'

const schema = yup.object().shape({
    price: yup
        .number()
        .integer()
        .required("Pole jest wymagane"),
})

export default schema
