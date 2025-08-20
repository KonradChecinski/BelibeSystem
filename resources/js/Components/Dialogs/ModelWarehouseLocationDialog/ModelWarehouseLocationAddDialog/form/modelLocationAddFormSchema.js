import * as yup from 'yup'

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Pole jest wymagane"),

    type: yup
        .string()
        .required("Pole jest wymagane")
        .oneOf(['room', 'aisle', 'shelf'], "Nieprawidłowy typ lokalizacji"),

    destination_id: yup
        .string()
        .nullable()
        .when('type', (type) =>
            type[0] !== 'room'
                ? yup.string().required("Pole jest wymagane dla tego typu")
                : yup.string().nullable()
        )
})


export default schema
