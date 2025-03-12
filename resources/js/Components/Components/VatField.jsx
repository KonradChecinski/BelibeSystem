import {FormControl, InputAdornment, OutlinedInput} from "@mui/material";

export function VatField({vat, setVat}) {

    const onKeyPress = (event) => {
        const regex = /^[0-9\b]+$/;

        const key = event.key;
        const keyCode = event.keyCode;

        let oldValue = event.target.defaultValue.replace(/,/g, "").replace(/\./g, "");
        let value = "";

        if (regex.test(key)) {
            value = "" + oldValue + key
            setVat(value)
        } else if (keyCode === 8) {
            value = oldValue.slice(0, -1)
            setVat(value)
        }
    }


    return (
        <FormControl sx={{m: 0, width: '25ch'}} variant="outlined">
            <OutlinedInput
                id="outlined-adornment-weight"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                onKeyDown={onKeyPress}
                value={vat}

            />
        </FormControl>
    );
}
