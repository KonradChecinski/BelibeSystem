export default function toLocaleString(number) {
    const lang = window.document.getElementsByTagName("html")[0]?.lang || "en";
    let locale = "";
    let option = "";

    switch (lang) {
        case"pl":
            locale = "pl-PL"
            option = {style: "currency", currency: "PLN"}
            break;
        case "en":
            locale = "en-US"
            option = {style: "currency", currency: "EUR"}
            break;
    }
    return number.toLocaleString(locale, option);
}
