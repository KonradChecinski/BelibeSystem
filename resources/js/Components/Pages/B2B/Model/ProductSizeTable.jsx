import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {sortBySizesName} from "@/Functions/sortBySizes";
import {useState} from "react";


export default function ProductSizeTable({model}) {
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
                <TableBody>
                    <TableRow>
                        {sortBySizesName(model.sizes).map(size => (
                            <HoveringCell column={size.id} key={size.id}>{size.name}</HoveringCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

    );
}
