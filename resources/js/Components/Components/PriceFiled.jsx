import {FormControl, InputAdornment, OutlinedInput} from "@mui/material";

export function PriceFiled({price, setPrice, currency, disabled = false}, props) {
    let newPrice = numberPrice(price)

    const onKeyPress = (event) => {
        const regex = /^[0-9\b]+$/;

        const key = event.key;
        const keyCode = event.keyCode;

        let oldValue = event.target.defaultValue.replace(/,/g, "").replace(/\./g, "");
        let value = "";

        if (regex.test(key)) {
            value = "" + oldValue + key
            setPrice(value)
        } else if (keyCode === 8) {
            value = oldValue.slice(0, -1)
            setPrice(value)
        }
    }


    function numberPrice(number) {
        return (Number(number / 100).toLocaleString(undefined, {minimumFractionDigits: 2, useGrouping: false}));
    }

    return (
        <FormControl sx={{m: 0, width: '25ch'}} variant="outlined" disabled={disabled}>
            <OutlinedInput
                {...props}
                id="outlined-adornment-weight"
                endAdornment={
                    <InputAdornment position="end">
                        {currency}
                    </InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                onKeyDown={onKeyPress}
                value={newPrice}
            />
        </FormControl>
    );
}
