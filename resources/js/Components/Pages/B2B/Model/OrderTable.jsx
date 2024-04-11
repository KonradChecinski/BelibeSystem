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


export default function OrderTable({model}) {

    const handleOnChange = debounce(change => {
        console.log(change);
        enqueueSnackbar("Zmieniono ilość produktów na " + change, {variant: "success"})

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
                    }
                }}
            >

                <TableHead>
                    <TableRow sx={{
                        borderRadius: 1
                    }}>
                        <TableCell align={"center"}>Kolor</TableCell>
                        <TableCell align={"center"} sx={{width: 120}}>Zdjęcie</TableCell>
                        {sortBySizesName(model.sizes).map(size => (
                            <TableCell align={"center"} key={size.id}>{size.name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {model.colors.sort(sortByColorShortcut).map(color => {
                        const image = color.images.find(i => i.order === 0);
                        return (
                            <TableRow hover key={color.id} sx={{height: 165}}>
                                <TableCell align={"center"}>
                                    <Typography variant="h5" textAlign={"center"} gutterBottom>
                                        {color.shortcut}
                                    </Typography>
                                    <Typography variant="body2" textAlign={"center"}>
                                        {color.name}
                                    </Typography>
                                </TableCell>
                                <TableCell align={"center"}>

                                    <Box component={"img"}
                                         src={route("images.webp", {path: image.path})}
                                         width={100}
                                    />

                                </TableCell>
                                {sortBySizesName(model.sizes).map((size, id) => {
                                    const product = color.products.find(p => p.size.id === size.id);
                                    return (
                                        <TableCell align={"center"} key={id}>
                                            {product ?
                                                <>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Ilość"
                                                        variant="outlined"
                                                        type={"number"}
                                                        defaultValue={0}
                                                        onChange={(e) => handleOnChange(e.target.value)}
                                                        InputProps={{
                                                            inputProps: {
                                                                min: 0,
                                                                max: product.quantity,
                                                                style: {
                                                                    textAlign: "center"
                                                                }
                                                            }
                                                        }}
                                                        sx={{
                                                            width: "20ch",

                                                        }}
                                                    />
                                                    <Typography variant="caption" display="block" gutterBottom>
                                                        Dostępność: {product.quantity}
                                                    </Typography>
                                                </>

                                                :
                                                ""
                                            }
                                        </TableCell>


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
