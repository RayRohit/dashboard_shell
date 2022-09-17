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
    // FormControl,
    // InputLabel,
    // MenuItem,
    Paper,
    // Select,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import axios from "axios";
import { Heatmap } from "../Heatmap/Heatmap";
import { colorSecSchema } from "../Heatmap/colorSchema";
import { Circle } from "@mui/icons-material";
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
    const [heatMapData, setHeatMapData] = useState(null)
    // let [newTitle, setNewTitle] = useState('Temperature')
    // const [videoPath, setVideoPath] = useState(null)

    let TemperatureValue = [];
    let MinValue = [];
    const [Graph, setGraph] = useState("Fire Temperature Curve");
    let MaxValue = [];
    let MaxThres = [];
    let MinThres = [];
    let ImageData = [];
    let Range = [];
    let xAxis = [];
    const [Image, setImage] = useState(null);
    const [SegImage, setSegImage] = useState(null);
    const [frame, setFrame] = useState(0)

    for(let i=0 ; i <= 74; i++){
        if(i%2 === 0) Range.push(i)
    }
    // Range.push(74)

    // console.log(props.data);
    // console.log(props.filter)
    let c = 0;
    props.data.forEach((item) => {
        // console.log(item)
        // if (!md && !lg && !xl) {
        //     if (c % 15 === 0) Range.push(item.Frame_no);
        // } else if (md && !lg && !xl) {
        //     if (c % 15 === 0) Range.push(item.Frame_no);
        // } else if (md && lg && !xl) {
        //     if (c % 10 === 0) Range.push(item.Frame_no);
        // } else if (md && lg && xl) {
        //     if (c % 5 === 0) Range.push(item.Frame_no);
        // }
        xAxis.push(item.Frame_no);
        TemperatureValue.push(Math.ceil(item[`${props.filter}`]));
        ImageData.push(item.Image_Path);
        c++;
    });
    useEffect(() => {
        TemperatureValue = [];
        MinValue = [];
        MaxValue = [];
        Range = [];
        if (props.filter === "Smoke_Percentage") {
            props.data.forEach((item) => {
                console.log(Math.ceil(item[`${props.filter}`]));
                // if (md && !lg && !xl) {
                //     if (c % 15 === 0) Range.push(item.Frame_no);
                // } else if (!md && lg && !xl) {
                //     if (c % 10 === 0) Range.push(item.Frame_no);
                // } else if (!md && !lg && xl) {
                //     if (c % 5 === 0) Range.push(item.Frame_no);
                // }
                xAxis.push(item.Frame_no);
                TemperatureValue.push(item[`${props.filter}`]);
                ImageData.push(item.Image_Path);
            });
        } else
            props.data.forEach((item) => {
                // if (md && !lg && !xl) {
                //     if (c % 15 === 0) Range.push(item.Frame_no);
                // } else if (!md && lg && !xl) {
                //     if (c % 10 === 0) Range.push(item.Frame_no);
                // } else if (!md && !lg && xl) {
                //     if (c % 5 === 0) Range.push(item.Frame_no);
                // }
                xAxis.push(item.Frame_no);
                TemperatureValue.push(Math.ceil(item[`${props.filter}`]));
                ImageData.push(item.Image_Path);
            });
        for (let i in TemperatureValue) {
            MinValue.push(Math.min(...TemperatureValue)); //Math.min(...TemperatureValue)
            MaxValue.push(Math.max(...TemperatureValue));
            MinThres.push(495);
            MaxThres.push(505);
        }
        // if(props.filter === 'Smoke_Percentage') setNewTitle('Percentage')
    }, [filter]);
    // console.log(TemperatureValue);
    for (let i in TemperatureValue) {
        MinValue.push(Math.min(...TemperatureValue)); //Math.min(...TemperatureValue)
        MaxValue.push(Math.max(...TemperatureValue));
        MinThres.push(495);
        MaxThres.push(505);
    }

    // console.log(props.filter.split('_')[0])

    

    let width = 400
    let height = 322

    

    const series = [
        
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
    const options = {
        chart: {
            // height: 200,
            type: "line",
            zoom: {
                enabled: false,
            },
            events: {
                markerClick: function (event, chartContext, { dataPointIndex }) {
                    // console.log(xAxis[dataPointIndex]);
                    setDatePoint(dataPointIndex);
                    setImage(ImageData[dataPointIndex]);
                    setFrame(xAxis[dataPointIndex])
                    jsCookie.set('flag',true)

                    try {
                        axios.post("http://173.247.237.40:5000/analyzegraph", {
                            image_path: ImageData[dataPointIndex]
                        }).then((res) => {
                            console.log(res.data)
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
            // tickAmount: 13,
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
                    rotate: -90,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
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
                title: {
                    text: `${props.Title}`,
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
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        // height: "70%",
        boxShadow: "10px 5px 10px #222",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: "5px",
        overflow: "auto",
    };
    // console.log(props.filter)

    return (
        <>
            <Box
                sx={{
                    // minWidth: 120,
                    width: '80%',
                    height: '70%',
                    backgroundColor: "#FFF !important",
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
                <Chart options={options} series={series} type="line" height={340} flag={true} />
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
                            justifyContent: "space-between",
                            borderRadius: '10px'
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                            Curve Analysis of <i>"Frame Number {frame}"</i>
                        </Typography>
                        <HighlightOffIcon onClick={handleClose} />
                    </Paper>
                    <Paper sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={6}>
                                <Paper elevation={3} sx={{ p: 2, margin: '10px', borderRadius: '10px' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>Original Frame</Typography>
                                    <Typography variant="p" sx={{ fontSize: '12px', fontWeight: 'bolder', color: '#6c757d' }}>
                                        Raw IR frame of <i>"{frame} Frame"</i>
                                    </Typography>
                                </Paper>
                                <Paper sx={{ margin: '10px', textAlign: 'center', p: 2, borderRadius: '10px' }}>
                                    <img src={`http://173.247.237.40:5000/${Image}`} alt={`http://173.247.237.40:5000/${Image}`} width='400px' height='322px' style={{
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
                                {
                                    heatMapData !== null &&
                                    <>
                                        <Paper sx={{ display: 'flex', justifyContent: 'center', margin: '10px', p: 2, borderRadius: '10px' }}>
                                            <Box sx={{ pt: 2, pl: 1 }}>
                                                {
                                                    heatMapData === null ? <>
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
                                                            <CircularProgress />
                                                        </Box>
                                                    </> :
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Heatmap data={heatMapData} width={width} height={height} />
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
                                                                {/* <h6 style={{margin:'0 !important'}}>Temperature Scale ( <sup>o</sup>C )</h6> */}
                                                                <Typography variant="h6" sx={{ margin: '0px !important', fontSize: '12px !important', fontWeight: 'bolder' }}>Temperature Scale ( <sup>o</sup>C )</Typography>
                                                            </Box>
                                                        </Box>
                                                }
                                            </Box>
                                        </Paper>
                                    </>
                                }
                            </Grid>
                            <Grid item sm={12} md={12} lg={6}>
                                <Paper elevation={3} sx={{ p: 2, margin: '10px', borderRadius: '10px' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>Segmented Frame</Typography>
                                    <Typography variant="p" sx={{ fontSize: '12px', fontWeight: 'bolder', color: '#6c757d' }}>Segmented image seperating the flame (white) and the smoke (grey) with the background eliminated(black).</Typography>

                                </Paper>
                                <Paper sx={{ margin: '10px', textAlign: 'center', p: 2, borderRadius: '10px' }}>
                                    {
                                        SegImage !== null &&
                                        <Box sx={{ pt: 5 }}>
                                            <img src={`http://173.247.237.40:5000/${SegImage}`} width='400px' height='322px' style={{
                                                borderRadius: "20px",
                                            }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <Paper sx={{ backgroundColor: '#000 !important', minWidth: '400px', fontSize: '15px !important', display: 'flex', justifyContent: 'center' }}>
                                                    <List dense={true} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
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
                                                            // secondary={secondary ? 'Secondary text' : null}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </Paper>
                                            </Box>
                                        </Box>
                                    }
                                </Paper>
                            </Grid>

                        </Grid>
                    </Paper>

                </Box>
            </Modal>
        </>
    );
}