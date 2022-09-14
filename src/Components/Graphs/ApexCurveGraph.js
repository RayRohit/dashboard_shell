import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Box from "@mui/material/Box";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    useMediaQuery,
    useTheme,
} from "@mui/material";
// import { range } from "d3";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "50%",
    backgroundColor: "#fff",
    boxShadow: 24,
    border: "0px solid #fff",
    p: 4,
};
export default function ApexChart(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [dataPoint, setDatePoint] = useState(0);
    const [filter, setFilter] = useState("Fire_Temp");
    const themes = useTheme();
    const md = useMediaQuery(themes.breakpoints.up("md"));
    const lg = useMediaQuery(themes.breakpoints.up("lg"));
    const xl = useMediaQuery(themes.breakpoints.up("xl"));

    let TemperatureValue = [];
    let MinValue = [];
    const [Graph, setGraph] = useState("Fire Temperature Curve");
    let MaxValue = [];
    let ImageData = [];
    let Range = [];
    let xAxis = [];
    const [Image, setImage] = useState(null);
    // console.log(props.data);
    let c = 0;
    props.data.forEach((item) => {
        if (!md && !lg && !xl) {
            if (c % 15 === 0) Range.push(item.FrameNo);
        } else if (md && !lg && !xl) {
            if (c % 15 === 0) Range.push(item.FrameNo);
        } else if (md && lg && !xl) {
            if (c % 10 === 0) Range.push(item.FrameNo);
        } else if (md && lg && xl) {
            if (c % 5 === 0) Range.push(item.FrameNo);
        }
        xAxis.push(item.FrameNo);
        TemperatureValue.push(Math.ceil(item[`${props.filter}`]));
        ImageData.push(item.imagepath);
        c++;
    });
    useEffect(() => {
        TemperatureValue = [];
        MinValue = [];
        MaxValue = [];
        Range = [];
        if (props.filter === "smoke_percentage") {
            props.data.forEach((item) => {
                // console.log(Math.ceil(item[`${filter}`] * 100));
                if (md && !lg && !xl) {
                    if (c % 15 === 0) Range.push(item.FrameNo);
                } else if (!md && lg && !xl) {
                    if (c % 10 === 0) Range.push(item.FrameNo);
                } else if (!md && !lg && xl) {
                    if (c % 5 === 0) Range.push(item.FrameNo);
                }
                xAxis.push(item.FrameNo);
                TemperatureValue.push(Math.round(item[`${props.filter}`]) * 100);
                ImageData.push(item.imagepath);
            });
        } else
            props.data.forEach((item) => {
                if (md && !lg && !xl) {
                    if (c % 15 === 0) Range.push(item.FrameNo);
                } else if (!md && lg && !xl) {
                    if (c % 10 === 0) Range.push(item.FrameNo);
                } else if (!md && !lg && xl) {
                    if (c % 5 === 0) Range.push(item.FrameNo);
                }
                xAxis.push(item.FrameNo);
                TemperatureValue.push(Math.ceil(item[`${props.filter}`]));
                ImageData.push(item.imagepath);
            });
        for (let i in TemperatureValue) {
            MinValue.push(Math.min(...TemperatureValue)); //Math.min(...TemperatureValue)
            MaxValue.push(Math.max(...TemperatureValue));
        }
    }, [filter]);
    // console.log(TemperatureValue);
    for (let i in TemperatureValue) {
        MinValue.push(Math.min(...TemperatureValue)); //Math.min(...TemperatureValue)
        MaxValue.push(Math.max(...TemperatureValue));
    }

    const series = [
        {
            name: "Min Temperature",
            data: MinValue,
            color: "#bbe8fc",
        },
        {
            name: "Temperature",
            data: TemperatureValue,
        },
        {
            name: "Max Temperature",
            data: MaxValue,
            color: "#fcf9bb",
        },
    ];
    const options = {
        chart: {
            // height: 200,
            type: "line",
            zoom: {
                enabled: false,
            },
            events: {
                markerClick: function (event, chartContext, { dataPointIndex }) {
                    console.log(dataPointIndex);
                    setDatePoint(dataPointIndex);
                    setImage(ImageData[dataPointIndex]);
                    handleOpen();
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        // markers: {
        //   size: 1,
        //   colors: ["#e0f7fa", "#fff", "#e0f2f1"],
        //   strokeColor: "#00BAEC",
        //   strokeWidth: 3,
        // },
        stroke: {
            width: 3.5,
            curve: "smooth",
        },
        fill: {
            type: "vertical",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                colorStops: [
                    {
                        offset: 0,
                        color: "#304ffe",
                        opacity: 1,
                    },
                    {
                        offset: 40,
                        color: "#304ffe",
                        opacity: 1,
                    },
                    {
                        offset: 70,
                        color: "#fff",
                        opacity: 1,
                    },
                    {
                        offset: 100,
                        color: "#f44336",
                        opacity: 1,
                    },
                ],
            },
        },
        xaxis: {
            type: xAxis,
            categories: Range,
            tickAmount: 13,
            tickPlacement: "between",
            min: undefined,
            max: undefined,
            range: undefined,
            floating: false,
            decimalsInFloat: undefined,
            overwriteCategories: undefined,
            position: "bottom",
            labels: {
                show: true,
                rotate: -45,
                rotateAlways: false,
                hideOverlappingLabels: true,
                showDuplicates: false,
                trim: false,
                minHeight: undefined,
                maxHeight: 120,
                style: {
                    colors: [],
                    fontSize: "12px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 'bold',
                    cssClass: "apexcharts-xaxis-label",
                },
                offsetX: 0,
                offsetY: 0,
                format: undefined,
                formatter: undefined,
                datetimeUTC: true,
                datetimeFormatter: {
                    year: "yyyy",
                    month: "MMM 'yy",
                    day: "dd MMM",
                    hour: "HH:mm",
                },
            },
            axisBorder: {
                show: false,
                color: "#78909C",
                height: 1,
                width: "100%",
                offsetX: 0,
                offsetY: 0,
            },
            axisTicks: {
                show: false,
                borderType: "solid",
                color: "#78909C",
                height: 6,
                offsetX: 0,
                offsetY: 0,
            },
            title: {
                text: "Frames",
                offsetX: 0,
                offsetY: 0,
                style: {
                    color: "#008FFB",
                    fontSize: "12px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: 'bolder',
                    cssClass: "apexcharts-xaxis-title",
                },
            },
            crosshairs: {
                show: true,
                width: 1,
                position: "back",
                opacity: 0.9,
                stroke: {
                    color: "#b6b6b6",
                    width: 0,
                    dashArray: 0,
                },
                fill: {
                    type: "solid",
                    color: "#B1B9C4",
                    gradient: {
                        colorFrom: "#D8E3F0",
                        colorTo: "#BED1E6",
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    },
                },
                dropShadow: {
                    enabled: false,
                    top: 0,
                    left: 0,
                    blur: 1,
                    opacity: 0.4,
                },
            },
            tooltip: {
                enabled: true,
                formatter: undefined,
                offsetY: 0,
                style: {
                    fontSize: 0,
                    fontFamily: 0,
                },
            },
        },
        yaxis: [
            {
                min: MinValue[0] - 5,
                max: MaxValue[0] + 5,
                tickAmount:3,
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                    color: "#008FFB",
                },
                labels: {
                    style: {
                        // colors: "#008FFB",
                        fontWeight: 'bold'
                    },
                },
                title: {
                    text: `${Graph}`,
                    style: {
                        color: "#008FFB",
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
        ],
    };

    // console.log(props.filter)

    return (
        <>
            <Box
                sx={{
                    // minWidth: 120,
                    width: '100%',
                    // backgroundColor: "#172b4d",
                    padding: "27px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    boxShadow: '5px 5px 10px',
                    borderRadius: '10px'
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        color: "#fff",
                    }}
                >
                </div>
                <Chart options={options} series={series} type="line" height={300} />
            </Box>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {" "}
                    <Paper
                        elevation={0}
                        sx={{
                            padding: "10px",
                            display: "flex",
                            direction: "row",
                            justifyContent: "flex-end",
                        }}
                    >
                        <HighlightOffIcon onClick={handleClose} />
                    </Paper>
                    <Typography variant="h6" component="h2">
                        {dataPoint}
                    </Typography>
                    <Typography variant="h6" component="h2">
                        {Image}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}