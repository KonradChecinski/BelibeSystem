import {
    Box, debounce,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {sortBySizesName} from "@/Functions/sortBySizes";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import {enqueueSnackbar} from "notistack";
import {useTheme} from "@mui/material/styles";
import {useState} from "react";


export default function ProductOrderTable({model, lightbox, imageArray}) {
    // const [hoveredColumn, setHoveredColumn] = useState(null);

    const HoveringCell = ({children, column, disabled = false, header = false, sx}) => {
        return (
            <TableCell
                align={"center"}
                sx={{
                    bgcolor: disabled ? "disabled.background" : "",
                    ...sx
                }}
                // sx={{
                //     bgcolor: disabled ? "disabled.background" : hoveredColumn === column ? header ? "cyan" : "hoveredCell.background" : "",
                //     ...sx
                // }}
                // onMouseEnter={() => setHoveredColumn(column)}
                // onMouseLeave={() => setHoveredColumn(null)}
            >
                {children}
            </TableCell>
        )
    }

    const handleOnChange = debounce((e, value) => {
        if (value === "") {
            e.target.value = 0;
            value = 0;
        }
        console.log(value);
        enqueueSnackbar("Zmieniono ilość produktów na " + value, {variant: "success"})

    }, 1000);

    return (
        <TableContainer sx={{overflowX: "initial", borderRadius: 1}} component={Paper}>
            <Table
                aria-label="simple table"
                stickyHeader={true}
                sx={{
                    "& th": {
                        top: 81,
                    },
                    "& th:first-of-type": {
                        borderRadius: 1,
                        borderBottomRightRadius: 0,
                        borderTopRightRadius: 0
                    },
                    "& th:last-of-type": {
                        borderRadius: 1,
                        borderBottomLeftRadius: 0,
                        borderTopLeftRadius: 0
                    },
                }}
            >

                <TableHead>
                    <TableRow sx={{
                        borderRadius: 1
                    }}>
                        <HoveringCell column={1} header={true}>Kolor</HoveringCell>
                        <HoveringCell column={2} header={true} sx={{width: 120}}>Zdjęcie</HoveringCell>
                        {sortBySizesName(model.sizes).map(size => (
                            <HoveringCell column={2 + size.id} header={true} key={size.id}>{size.name}</HoveringCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {model.colors.sort(sortByColorShortcut).map(color => {
                        const image = color.images.find(i => i.order === 0);
                        const imageIndex = imageArray.findIndex(i => i.id === image.id);
                        return (
                            <TableRow hover key={color.id} sx={{height: 105}}>
                                <HoveringCell column={1}>
                                    <Typography variant="h5" textAlign={"center"} gutterBottom>
                                        {color.shortcut}
                                    </Typography>
                                    <Typography variant="body2" textAlign={"center"}>
                                        {color.name}
                                    </Typography>
                                </HoveringCell>
                                <HoveringCell column={2}>

                                    <Box component={"img"}
                                         src={route("images.webp", {path: image.path})}
                                         width={50}
                                         onClick={() => lightbox.loadAndOpen(imageIndex)}
                                         sx={{
                                             m: "auto",
                                             cursor: "pointer",
                                         }}
                                    />

                                </HoveringCell>
                                {sortBySizesName(model.sizes).map((size, id) => {
                                    const product = color.products.find(p => p.size.id === size.id);
                                    let quantity = product?.quantity;
                                    if (quantity > 30) quantity = 30;
                                    let quantityText = "";
                                    let quantityColor = "";
                                    switch (true) {
                                        case quantity === 0:
                                            quantityText = "Brak";
                                            quantityColor = "error.main";
                                            break;
                                        case quantity <= 5:
                                            quantityText = "Ostatnie sztuki!";
                                            quantityColor = "warning.main";
                                            break;
                                        case quantity <= 10:
                                            quantityText = "Mała ilość";
                                            quantityColor = "warning.main";
                                            break;
                                        case quantity <= 20:
                                            quantityText = "Średnia ilość";
                                            quantityColor = "info.main";
                                            break;
                                        default:
                                            quantityText = "Duża ilość";
                                            quantityColor = "success.main";
                                            break;
                                    }
                                    return (
                                        <HoveringCell column={2 + size.id} key={id} disabled={quantity === 0}>
                                            {product ?
                                                <>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Ilość"
                                                        variant="outlined"
                                                        type={"number"}
                                                        defaultValue={0}
                                                        disabled={quantity === 0}
                                                        onChange={(e) => handleOnChange(e, e.target.value)}
                                                        InputProps={{
                                                            inputProps: {
                                                                min: 0,
                                                                max: quantity,
                                                                style: {
                                                                    textAlign: "center",
                                                                    fontSize: 14
                                                                }
                                                            }
                                                        }}
                                                        sx={{
                                                            width: "20ch",

                                                        }}
                                                    />
                                                    <Box sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        gap: 0.5,
                                                        mt: 0.5
                                                    }}>
                                                        {/*<Typography variant="caption">*/}
                                                        {/*    Dostępność:*/}
                                                        {/*</Typography>*/}
                                                        <Typography variant="body2" sx={{color: quantityColor}}>
                                                            {quantityText}
                                                            {/*({quantity})({product.quantity})*/}
                                                        </Typography>
                                                    </Box>

                                                </>

                                                :
                                                ""
                                            }
                                        </HoveringCell>


                                    )
                                })}
                            </TableRow>
                        )
                    })}

                </TableBody>
            </Table>
        </TableContainer>
    );
}
