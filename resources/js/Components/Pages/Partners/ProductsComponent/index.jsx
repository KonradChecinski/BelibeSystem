import {Box, Card, Typography,} from "@mui/material";
import {ImportExport, Inventory} from "@mui/icons-material";
import ProductsTable from "@/Components/Table/Partners/ProductsTable";


export default function ProductsComponent({partner, products}) {


    return (
        <Card sx={{height: 1, flex: 1, p: 1, position: "relative"}}>
            <Box sx={{height: 1, display: "flex", flexDirection: "column", gap: 1, pt: 1}}>

                <Typography
                    sx={{display: "flex", gap: 1, alignItems: "center"}}>
                    <Inventory fontSize={"large"}/>
                    Produkty
                </Typography>
                <ProductsTable products={products} readOnly={false} partner={partner}/>
            </Box>
        </Card>
    );
}
