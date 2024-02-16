import * as yup from 'yup'

const schema = yup.object().shape({
    type: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        }),
    name: yup
        .string()
        .required("Pole jest wymagane"),
    value: yup
        .number()
        .typeError("Wartość musi być liczbą")
        .required("Pole jest wymagane")
        .min(0, "Wartość musi być większa lub równa 0"),
})

export default schema
