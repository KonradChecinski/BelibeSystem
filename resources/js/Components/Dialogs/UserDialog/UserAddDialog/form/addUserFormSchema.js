import * as yup from 'yup'
import {number} from "yup";

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),
    email: yup
        .string()
        .email("Podaj poprawny email")
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
