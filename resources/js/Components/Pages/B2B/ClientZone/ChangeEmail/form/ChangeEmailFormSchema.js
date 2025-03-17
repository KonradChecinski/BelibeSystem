import * as yup from 'yup'

const schema = yup.object().shape({
    email: yup
        .string()
        .required('Adres email jest wymagany')
        .email('Niepoprawny adres email'),
    email_confirmation: yup
        .string()
        .required('Potwierdzenie adresu email jest wymagane')
        .email('Niepoprawny adres email')
        .oneOf([yup.ref('email'), null], 'Adresy email nie są takie same')
})

export default schema
