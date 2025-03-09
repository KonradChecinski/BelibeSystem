import * as yup from 'yup'

const schema = yup.object().shape({
    date: yup
        .mixed()
        .required("Pole jest wymagane"),
    file: yup
        .mixed()
        .required("Pole jest wymagane")
        .test("fileSize", "Plik jest za duży", (value) => {
            if (!value) {
                return true
            }
            return value.size <= 10240
        })
        .test("fileType", "Nieprawidłowy format pliku", (value) => {
            if (!value) {
                return true
            }
            return value.type === "text/csv"
        })
})

export default schema
