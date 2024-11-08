import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {sortByColorShortcut} from "@/Functions/sortByColorShortcut";
import {useState} from "react";


export default function ProductColorTable({model, lightbox, imageArray}) {
    const [hoveredColumn, setHoveredColumn] = useState(null);

    const HoveringCell = ({children, column}) => {
        return (
            <TableCell
                align={"center"}
                sx={{bgcolor: hoveredColumn === column ? "rgba(0, 0, 0, 0.04)" : ""}}
                onMouseEnter={() => setHoveredColumn(column)}
                onMouseLeave={() => setHoveredColumn(null)}
            >
                {children}
            </TableCell>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {model.colors.sort(sortByColorShortcut).map(color => (
                            <HoveringCell column={color.id} key={color.id}>{color.shortcut}</HoveringCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {model.colors.sort(sortByColorShortcut).map(color => (
                            <HoveringCell column={color.id} key={color.id}>{color.name}</HoveringCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        {model.colors.sort(sortByColorShortcut).map(color => {
                            const image = color.images?.find(i => i.order === 0);
                            const imageIndex = image ? imageArray?.findIndex(i => i.id === image.id) : null;

                            return (
                                <HoveringCell column={color.id} key={color.id}>
                                    {image ?
                                        (
                                            <Box component={"img"}
                                                 src={route("images.webp", {slug: image.slug})}
                                                 width={50}
                                                 onClick={() => lightbox.loadAndOpen(imageIndex)}
                                                 sx={{
                                                     m: "auto",
                                                     cursor: "pointer",
                                                     minWidth: 50
                                                 }}
                                            />
                                        )
                                        :
                                        (
                                            <Box component={"img"}
                                                 src={route("images.webp", {slug: "brak.jpg"})}
                                                 width={50}
                                                 onClick={() => lightbox.loadAndOpen(1)}
                                                 sx={{
                                                     m: "auto",
                                                     cursor: "pointer",
                                                     minWidth: 50
                                                 }}
                                            />
                                        )
                                    }


                                </HoveringCell>
                            )
                        })}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

    );
}
