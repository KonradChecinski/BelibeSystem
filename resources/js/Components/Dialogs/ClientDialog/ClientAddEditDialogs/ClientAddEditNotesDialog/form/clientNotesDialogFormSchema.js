import * as yup from 'yup'

const schema = yup.object().shape({
    text: yup
        .string()
        .required("Pole jest wymagane"),
})

export default schema
