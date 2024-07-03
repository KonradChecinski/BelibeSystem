import {Card, CardContent, Tooltip, Typography} from "@mui/material";
import {LineChart, LinePlot} from '@mui/x-charts/LineChart';
import moment from "moment";
import {
    BarPlot,
    ChartsAxisHighlight, ChartsAxisHighlightPath, ChartsGrid, ChartsReferenceLine,
    ChartsTooltip,
    ChartsXAxis,
    ChartsYAxis,
    ResponsiveChartContainer
} from "@mui/x-charts";
import {ChartsOverlay} from "@mui/x-charts/ChartsOverlay";
import toLocaleString from "@/Functions/toLocaleString";

import {
    blueberryTwilightPalette,
    mangoFusionPalette,
    cheerfulFiestaPalette,
} from '@mui/x-charts/colorPalettes';

export default function OrdersPlot(props) {
    const b2bOrder = props.orders.b2b;
    const otherOrder = props.orders.other;

    console.log(b2bOrder, otherOrder)
    let xAxis = [];
    let yB2bMoney = [];
    let yB2bCount = [];
    let yOtherMoney = [];
    let yOtherCount = [];

    for (let i = 6; i >= 0; i--) {
        xAxis.push(moment().subtract(i, 'days').format('Do MMMM'))

        const b2bOrderOfday = b2bOrder.filter(order =>
            moment(order.created_at).format('YYYY-MM-DD') === moment().subtract(i, 'days').format('YYYY-MM-DD')
        )
        const countB2bOrderOfday = b2bOrderOfday.length;
        const sumB2bMoneyOfday = b2bOrderOfday.reduce((acc, order) => {
            return acc + order.discounted_total_gross + order.delivery_gross
        }, 0);
        yB2bMoney.push(sumB2bMoneyOfday / 100);
        yB2bCount.push(countB2bOrderOfday);

        const otherOrderOfday = otherOrder.filter(order =>
            moment(order.ordered_at).format('YYYY-MM-DD') === moment().subtract(i, 'days').format('YYYY-MM-DD')
        )
        const countOtherOrderOfday = otherOrderOfday.length;
        const sumOtherMoneyOfday = otherOrderOfday.reduce((acc, order) => {
            return acc + order.total_gross + order.delivery_gross
        }, 0);

        yOtherMoney.push(sumOtherMoneyOfday);
        yOtherCount.push(countOtherOrderOfday);
    }

    return (
        <Card sx={{width: 1}}>
            <CardContent sx={{width: 1}}>
                <Typography variant="h5">
                    Zamówienia
                </Typography>
                <ResponsiveChartContainer
                    xAxis={[
                        {
                            id: 'time',
                            // label: "Czas",
                            data: xAxis,
                            scaleType: 'band',
                        }
                    ]}
                    yAxis={[
                        {
                            id: 'money',
                            scaleType: 'linear',
                        },
                        {
                            id: 'count',
                            scaleType: 'linear',
                            tickMinStep: 1,
                        },
                    ]}
                    series={[
                        {
                            type: "bar",
                            data: yB2bMoney,
                            label: 'B2B - wartość',
                            // stack: '',
                            yAxisKey: 'money',
                            // area: true,
                            highlightScope: {
                                highlighted: "series", faded: 'global'
                            },
                            valueFormatter: (value) => toLocaleString(value),
                        },
                        {
                            type: "line",
                            data: yB2bCount,
                            label: 'B2B - ilość',
                            // stack: '',
                            yAxisKey: 'count',
                            // area: true,
                            highlightScope: {
                                highlighted: "series", faded: 'global'
                            }
                        },


                        {
                            type: "bar",
                            data: yOtherMoney,
                            label: 'Platformy sprzedażowe - wartość',
                            // stack: '',
                            yAxisKey: 'money',
                            // area: true,
                            highlightScope: {
                                highlighted: "series", faded: 'global'
                            },
                            valueFormatter: (value) => toLocaleString(value),
                        },
                        {
                            type: "line",
                            data: yOtherCount,
                            label: 'Platformy sprzedażowe - ilość',
                            // stack: '',
                            yAxisKey: 'count',
                            // area: true,
                            highlightScope: {
                                highlighted: "series", faded: 'global'
                            }
                        },
                    ]}
                    grid={{vertical: true, horizontal: true}}
                    colors={cheerfulFiestaPalette}
                    height={300}
                >
                    <BarPlot/>
                    <LinePlot/>
                    <ChartsAxisHighlight x={"band"} y={"none"}/>
                    {/*<ChartsTooltip trigger={"item"}/>*/}
                    <ChartsTooltip trigger={"axis"}/>
                    <ChartsOverlay/>
                    <ChartsGrid vertical/>
                    <ChartsGrid horizontal/>
                    <ChartsXAxis position="bottom" axisId="time"/>
                    <ChartsYAxis position="left" axisId="money"/>
                    <ChartsYAxis position="right" axisId="count"/>
                </ResponsiveChartContainer>
            </CardContent>
        </Card>
    );
}
