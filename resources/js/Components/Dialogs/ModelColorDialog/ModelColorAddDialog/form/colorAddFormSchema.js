import * as yup from 'yup'

const schema = yup.object().shape({
    shortcut: yup
        .string()
        .required("Pole jest wymagane")
        .max(20, "Maksymalna długość symbolu to 20"),

    b2c_shortcut: yup
        .string()
        .required("Pole jest wymagane")
        .max(10, "Maksymalna długość symbolu koloru do sklepu to 20"),

    name: yup
        .string()
        .required("Pole jest wymagane"),

    b2c_product_name: yup
        .string()
        .required("Pole jest wymagane"),

    b2c_name: yup
        .mixed()
        .test('is-empty', 'Pole jest wymagane', function (value) {
            return typeof value === 'object' || (typeof value === 'string' && value.trim() !== '');
        }),
})

export default schema
