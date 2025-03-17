import * as yup from 'yup'

const schema = yup.object().shape({
    password: yup
        .string()
        .required('Hasło jest wymagany')
        .min(8, 'Hasło musi mieć minimum 8 znaków')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            'Hasło musi zawierać co najmniej jedną małą literę, jedną dużą literę i jedną cyfrę'
        ),
    password_confirmation: yup
        .string()
        .required('Potwierdzenie hasła jest wymagane')
        .oneOf([yup.ref('password'), null], 'Hasła muszą być takie same')
})

export default schema
