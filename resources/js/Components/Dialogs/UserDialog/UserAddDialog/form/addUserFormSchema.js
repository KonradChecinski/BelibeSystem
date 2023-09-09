import * as yup from 'yup'

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    email: yup
        .string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Podaj poprawny email")
        .required("Pole jest wymagane"),
    password: yup
        .string()
        .required("Pole jest wymagane")
        .min(8, "Hasło musi składać się z conajmniej 8 znaków"),
    roles: yup
        .array(undefined)
        .min(1, "Pole jest wymagane")
})

export default schema
