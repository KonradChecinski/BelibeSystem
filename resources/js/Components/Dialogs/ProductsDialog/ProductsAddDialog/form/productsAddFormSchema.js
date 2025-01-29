import * as yup from 'yup'

const schema = yup.object().shape({
    color: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        }),
    size: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        })
        .required("Pole jest wymagane"),
    name: yup
        .string()
        .required("Pole jest wymagane")
        .min(5, "Minimalna długość nazwy to 5"),
    name_b2c: yup
        .string()
        // .required("Pole jest wymagane")
        .min(5, "Minimalna długość nazwy to 5"),
    unit: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        })
        .required("Pole jest wymagane"),
})

export default schema
