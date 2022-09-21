import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Box from "@mui/material/Box";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import jsCookie from 'js-cookie'
import {
    CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from "@mui/material";
import axios from "axios";
import { Heatmap } from "../Heatmap/Heatmap";
import { colorSecSchema } from "../Heatmap/colorSchema";
import { Circle } from "@mui/icons-material";

export default function ApexChart(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [heatMapData, setHeatMapData] = useState(null)

    let TemperatureValue = [];
    let MinValue = [];
    let MaxValue = [];
    let MaxThres = [];
    let MinThres = [];
    let ImageData = [];
    let Range = [];
    let xAxis = [];
    const [Image, setImage] = useState(null);
    const [SegImage, setSegImage] = useState(null);
    const [frame, setFrame] = useState(0)

    for (let i = 0; i <= 74; i++) {
        if (i % 2 === 0) Range.push(i)
    }
    props.data.forEach((item) => {
        xAxis.push(item.Frame_no);
        TemperatureValue.push(Math.ceil(item[`${props.filter}`]));
        ImageData.push(item.Image_Path);
    });
    useEffect(() => {
        TemperatureValue = [];
        MinValue = [];
        MaxValue = [];
        Range = [];
        if (props.filter === "Smoke_Percentage") {
            props.data.forEach((item) => {
                console.log(Math.ceil(item[`${props.filter}`]));
                xAxis.push(item.Frame_no);
                TemperatureValue.push(item[`${props.filter}`]);
                ImageData.push(item.Image_Path);
            });
        } else
            props.data.forEach((item) => {
                xAxis.push(item.Frame_no);
                TemperatureValue.push(Math.ceil(item[`${props.filter}`]));
                ImageData.push(item.Image_Path);
            });
        TemperatureValue.forEach(() => {
            MinValue.push(Math.min(...TemperatureValue)); //Math.min(...TemperatureValue)
            MaxValue.push(Math.max(...TemperatureValue));
            MinThres.push(495);
            MaxThres.push(505);
        })
    }, [props.filter]);


    TemperatureValue.forEach(() => {
        MinValue.push(Math.min(...TemperatureValue)); //Math.min(...TemperatureValue)
        MaxValue.push(Math.max(...TemperatureValue));
        MinThres.push(495);
        MaxThres.push(505);
    })


    let width = 400
    let height = 322



    const FireSeries = [
        {
            name: "Min Threshold",
            data: MinThres,
            color: "#ff6d00",
        },
        {
            name: `${props.filter.split('_')[0]} ${props.filter.split('_')[1] === "Temp" ? "Temperature" : props.filter.split('_')[1]}`,
            data: TemperatureValue,
            color: '#01EEB8'
        },
        {
            name: "Max Threshold",
            data: MaxThres,
            color: "#f9a825",
        }
    ];

    const SmokeSeries = [
        {
            name: `${props.filter.split('_')[0]} ${props.filter.split('_')[1] === "Temp" ? "Temperature" : props.filter.split('_')[1]}`,
            data: TemperatureValue,
            color: '#01EEB8'
        }
    ];

    const options = {
        chart: {
            type: "line",
            zoom: {
                enabled: false,
            },
            events: {
                markerClick: function (event, chartContext, { dataPointIndex }) {
                    setImage(ImageData[dataPointIndex]);
                    setFrame(xAxis[dataPointIndex])
                    jsCookie.set('flag', 'graph')

                    try {
                        axios.post("http://173.247.237.40:3000/analyzegraph", {
                            image_path: ImageData[dataPointIndex]
                        }).then((res) => {
                            setHeatMapData(res.data[0].image_data)
                            setSegImage(res.data[1].segmented_img_path)
                        }).catch((err) => console.log(err))
                    } catch (e) {
                        console.log(e)
                    }
                    handleOpen();
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 3.5,
            curve: "smooth",
        },
        legend: {
            showForSingleSeries: true,
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
            tickPlacement: "between",
            min: 0,
            max: 74,
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
                height: 4,
                offsetX: 0,
                offsetY: 0,
            },
            title: {
                text: "Seconds",
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
                title: {
                    text: `${props.filter.split('_')[0]} ${props.filter.split("_")[1] === "Temp" ? "Temperature ( °C )" : `${props.filter.split("_")[1]} ( % )`}`,
                    rotate: -90,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: "rgb(0, 143, 251);",
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                min: MinValue[0] - 5,
                max: MaxValue[0] + 5,
                tickAmount: 3,
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
                tooltip: {
                    enabled: true,
                },
            },
        ],
    };
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        boxShadow: "10px 5px 10px #222",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: "5px",
        overflow: "auto",
    };

    return (
        <>
            <Box
                sx={{
                    width: '80%',
                    height: '70%',
                    backgroundColor: "#FFF !important",
                    padding: "15px",
                    paddingLeft: "27px",
                    paddingRight: "27px",
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
                <Chart options={options} series={props.filter.split("_")[0] === 'Smoke' ? SmokeSeries : FireSeries} type="line" height={350} flag={true} />
            </Box>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: "10px",
                            display: "flex",
                            direction: "row",
                            justifyContent: "space-between",
                            borderRadius: '10px',
                            width: '100%', p: 2
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            Curve Analysis of <i>"Frame Number {frame}"</i>
                        </Typography>
                        <HighlightOffIcon sx={{ cursor: 'pointer' }} onClick={() => {
                            setSegImage(null)
                            setHeatMapData(null)
                            handleClose()

                        }} />
                    </Paper>
                    <Paper sx={{ p: 2, mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={6}>
                                <Paper elevation={3} sx={{ p: 2, margin: '10px', borderRadius: '10px' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>Original Frame</Typography>
                                    <Typography variant="p" sx={{ fontSize: '12px', fontWeight: 'bolder', color: '#6c757d' }}>
                                        Raw IR frame of <i>"{frame} Frame"</i>
                                    </Typography>
                                </Paper>
                                <Paper sx={{ margin: '10px', textAlign: 'center', pt: 4, borderRadius: '10px', backgroundColor: 'whitesmoke !important', height: '455px !important' }}>
                                    <img src={`http://173.247.237.40:3000/${Image}`} alt='ImageHeatMap' width='400px' height='322px' style={{
                                        borderRadius: "20px",
                                    }} />
                                </Paper>
                            </Grid>
                            <Grid item sm={12} md={12} lg={6}>
                                <Paper elevation={3} sx={{ p: 2, margin: '10px', borderRadius: '10px' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>Heatmap of Frame</Typography>
                                    <Typography variant="p" sx={{ fontSize: '12px', fontWeight: 'bolder', color: '#6c757d' }}>
                                        Pixel-wise heat signature analysis tool representing the temperature at each point on the frame.
                                    </Typography>
                                </Paper>
                                <Box >
                                    {
                                        heatMapData === null ?
                                            <>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
                                                    <CircularProgress />
                                                </Box>
                                            </> :
                                            <Paper sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '10px', borderRadius: '10px', backgroundColor: 'whitesmoke !important', height: '455px !important' }}>
                                                <Heatmap data={heatMapData} width={width} height={height} Margin={1050} />
                                                <Box>
                                                    <List dense={true} sx={{ display: 'flex', flexDirection: 'row' }}>
                                                        {
                                                            Object.keys(colorSecSchema).map((key) => {
                                                                return (
                                                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>
                                                                        {key}
                                                                        <div style={{
                                                                            height: '25px', width: '25px', backgroundColor: colorSecSchema[`${key}`]
                                                                        }}>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </List>
                                                    <Typography variant="h6" sx={{ margin: '0px !important', fontSize: '12px !important', fontWeight: 'bolder', textAlign: 'center' }}>Temperature Scale ( <sup>o</sup>C )</Typography>
                                                </Box>
                                            </Paper>
                                    }
                                </Box>
                            </Grid>
                            <Grid item sm={12} md={12} lg={6}>
                                <Paper elevation={3} sx={{ p: 2, margin: '10px', borderRadius: '10px' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>Segmented Frame</Typography>
                                    <Typography variant="p" sx={{ fontSize: '12px', fontWeight: 'bolder', color: '#6c757d' }}>Segmented image seperating the flame (white) and the smoke (grey) with the background eliminated(black).</Typography>

                                </Paper>
                                <Box >
                                    {
                                        SegImage === null ?
                                            <>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
                                                    <CircularProgress />
                                                </Box>
                                            </>
                                            :
                                            <Paper sx={{ margin: '10px', textAlign: 'center', p: 2, borderRadius: '10px', backgroundColor: 'whitesmoke !important' }}>
                                                <img src={`http://173.247.237.40:3000/${SegImage}`} alt='Image2' width='400px' height='322px' style={{
                                                    borderRadius: "20px",
                                                }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Paper sx={{ backgroundColor: '#000 !important', minWidth: '400px', fontSize: '15px !important', display: 'flex', justifyContent: 'center', borderRadius: '10px' }}>
                                                        <List dense={true} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <Circle sx={{ color: '#FAF9F6' }} />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary="Fire"
                                                                    sx={{ color: '#fff' }}
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <Circle sx={{ color: 'grey !important' }} />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary="Smoke"
                                                                    sx={{ color: '#fff' }}
                                                                />
                                                            </ListItem>
                                                        </List>
                                                    </Paper>
                                                </Box>
                                            </Paper>
                                    }
                                </Box>
                            </Grid>

                        </Grid>
                    </Paper>

                </Box>
            </Modal>
        </>
    );
}