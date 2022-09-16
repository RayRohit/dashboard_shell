import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Avatar, Button, CircularProgress, FormControl, Grid, InputLabel, List, ListItem, ListItemIcon, ListItemText, MenuItem, Modal, Paper, Select, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import Drawerr from "./Drawer/Drawer";
import { ArrowDownward, ArrowUpward, Circle, Grading, HighlightOff, LocalFireDepartment, MenuOpen, Timer } from "@mui/icons-material";
import fire from '../../Images/fire.png'
import non_fire from '../../Images/non_fire.png'
import axios from "axios";
import LinearProgress from '@mui/material/LinearProgress';
import ApexChart from "../Graphs/ApexCurveGraph";
import { Heatmap } from "../Heatmap/Heatmap";
import above from '../../Images/above.png'
import below from '../../Images/below.png'
import fire1 from '../../Images/fire1.png'
import time from '../../Images/time.png'
import smoke from '../../Images/smoke.png'
import jsCookie from 'js-cookie'
import { colorSchema } from "../Heatmap/colorSchema";


const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);


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
    borderRadius: "10px",
    overflow: "auto",
    border: '1px solid '
};

export default function Dashboard() {
    const theme = useTheme();
    const mdBreak = useMediaQuery(theme.breakpoints.up('lg'));
    const [open, setOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [show, setShow] = useState('none')
    const [showProgress, setShowProgress] = useState('flex')
    const [file, setFile] = useState(null)

    const [heatMapData, setHeatMapData] = useState(null)
    // const [summary, setSummary] = useState({
    //     Fire: 0,
    //     AT: 0,
    //     BT: 0,
    //     NonFire: 0
    // })
    // const [Fire, setFire] = useState(0)
    // const [AT, setAT] = useState(0)
    // const [BT, setBT] = useState(0)
    // const [NonFire, setNonFire] = useState(0)


    // const [resetNotification, setResetNotification] = useState(false)
    const [imageData, setImageData] = useState({
        ImageData: null,
    })

    // console.log(data)

    const md = useMediaQuery(theme.breakpoints.up('md'))
    const lg = useMediaQuery(theme.breakpoints.up('lg'))
    const xl = useMediaQuery(theme.breakpoints.up('xl'))

    let width = 400
    let height = 322

    let array = []
    for (let i = 0; i < 50; i++)
        array.push(
            Math.ceil(Math.random() * i * 10)

        );

    // console.log(notificationsData)


    const videoRef = useRef();
    // const canvasRef = useRef();
    const [segCurve, setSegData] = useState(null);

    const handleDrawerOpen = () => {
        setOpen(true)
    }
    const handleDrawerClose = () => {
        setOpen(false);
    };

    // useEffect(() => {
    //     if (mdBreak) setOpen(mdBreak)
    // }, [mdBreak])
    useEffect(() => {
        setFile(file)
    }, [file])


    //      Notification api Call

    const [progress, setProgress] = useState(0);              // setting the Loading of the progress for the response

    // const [notifications, setNotifications] = useState([]); // for storing Notifications
    const [stopNot, setStopNot] = useState(true); // for stopping and resuming api calls for Notifications
    const [ImagePath, setImagePath] = useState(null); // for Storing ImagePath
    const [IntervalID, setIntervalId] = useState(null);
    // const [analysis, setAnalysis] = useState(true)    // for segemntation video and graph
    const [analysisDisplay, setAnalysisDisplay] = useState('none')
    const [upload, setUpload] = useState(false);

    const [allNotifications, setAllNotifications] = useState([]);
    const [fireNotifications, setFireNotifications] = useState([]);
    const [nonFireNotifications, setNonFireNotifications] = useState([]);
    const [belowThresholdNotifications, setBelowThresholdNotifications] = useState([]);
    const [aboveThresholdNotifications, setAboveThresholdNotifications] = useState([]);
    const [lastFrameNo, setLastFrameNo] = useState(0)
    const [Time, setTime] = useState(0)
    const [TitleDescription, setTitleDescription] = useState('Time vs Temperature graph of the Flame Temperature across the complete video.')

    // console.log(stopNot)

    useEffect(() => {
        console.log(stopNot)
        if (stopNot) {
            clearInterval(IntervalID);
        }
        else {
            const newIntervalID = setInterval(() => {
                // console.log(stopNot)
                try {
                    // setAT(prevData => 0)
                    // setBT(prevData => 0)
                    // setFire(prevData => 0)
                    // setNonFire(prevData => 0)
                    setIntervalId(newIntervalID)

                    axios
                        .post("http://173.247.237.40:5000/notification", {
                            unique_key: jsCookie.get('unique_key'),
                            frame_no: lastFrameNo
                        })
                        .then((res) => {
                            // console.log(res.data)
                            // setNotifications(prevData => [...Object.values(res.data),...notifications]);
                            // console.log(allNotifications);
                            // let all_notifications = [...allNotifications];
                            // setNotifications(res.data);


                            setAllNotifications([...res.data, ...allNotifications]);
                            setLastFrameNo(res.data[0].Frame_no)


                            // all_notifications = [...res.data, ...all_notifications]
                            // let fireNotifications = all_notifications.filter(x => x.msg === 'Optimum Threshold');
                            // setFireNotifications(fireNotifications);

                            // let nonFireNotifications = all_notifications.filter(x => x.msg === 'Non-Fire');
                            // setNonFireNotifications(nonFireNotifications);

                            // let below_Threshold_Notifications = all_notifications.filter(x => x.msg === 'Below Threshold');
                            // setBelowThresholdNotifications(below_Threshold_Notifications);

                            // let above_Threshold_Notifications = all_notifications.filter(x => x.msg === 'Above Threshold');
                            // setAboveThresholdNotifications(above_Threshold_Notifications);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    // console.log("Call");
                    // if(!stopNot){
                    //     // console.log(newIntervalID)
                    //     setStopNot(true)
                    //     setIntervalId(newIntervalID)
                    //     setAnalysisDisplay('block')
                    // }

                } catch (e) {
                    console.log(e);
                }
            }, 1000);
        }
    }, [stopNot]);

    useEffect(() => {

        let all_notifications = [...allNotifications];

        // all_notifications = [...res.data, ...all_notifications];

        setAllNotifications(all_notifications);

        let fireNotifications = all_notifications.filter(x => x.msg === 'Optimum Threshold');
        setFireNotifications([...fireNotifications]);

        let nonFireNotifications = all_notifications.filter(x => x.msg === 'Non-Fire');
        setNonFireNotifications([...nonFireNotifications]);

        let below_Threshold_Notifications = all_notifications.filter(x => x.msg === 'Below Threshold');
        setBelowThresholdNotifications([...below_Threshold_Notifications]);

        let above_Threshold_Notifications = all_notifications.filter(x => x.msg === 'Above Threshold');
        setAboveThresholdNotifications([...above_Threshold_Notifications]);

    }, [allNotifications.length])

    //   Handling the Uplaoding of the Video

    // console.log(allNotifications)

    const handleChange = (e) => {
        if (e.target.files[0] !== undefined) {          // video File
            setStopNot(false)
            setUpload(true)
            setShowProgress('block')
            setProgress(0)

            // for clearing all the notifications and all the progress
            setAllNotifications([])
            // allNotifications([])
            setAboveThresholdNotifications([])
            setBelowThresholdNotifications([])
            setNonFireNotifications([])
            setFireNotifications([])
            setAnalysisDisplay('none')
            if (!upload)
                setUpload(true)


            const formData = new FormData();
            if (e.target && e.target.files[0]) {
                formData.append("videos", e.target.files[0]);
                let uniqueid = Math.ceil(Math.random(200) * 1000).toString()
                formData.append("unique_key", uniqueid)
                jsCookie.set('unique_key', uniqueid)
                setStopNot(false);
                axios
                    .post("http://173.247.237.40:5000/uploadvideo", formData)
                    .then((res) => {
                        setSegData(res.data);
                        setShowProgress('none')
                        setAnalysisDisplay('block')
                    })
                    .catch((err) => console.log(err));
            }

            // if(setSegData !== null) setShowProgress('none')
            // else{
            //     if(progress < 90) setProgress((prevProgress) => (prevProgress >= 100 ? setShowProgress('none') : prevProgress + 10));
            // }

            setFile(URL.createObjectURL(e.target.files[0]));
            videoRef.current?.load();
        }

    };


    // console.log(segCurve)

    useEffect(() => {
        // console.log(progress)
        if (upload) {
            const timer = setInterval(() => {
                // console.log(progress)
                setProgress((prevProgress) => {
                    if (prevProgress < 90)
                        return (prevProgress >= 100 ? setShowProgress('none') : prevProgress + 5)
                    else if (prevProgress === 90) {
                        clearInterval(timer)
                        // setShowProgress('none')
                        return (prevProgress + 5)
                    }
                });
            }, 2000);
        }
    }, [upload]);

    function LinearProgressWithLabel(props) {
        return (
            <Box sx={{ display: `${showProgress}`, alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }

    const [alertFilter, setAlertFilter] = React.useState('');
    const [filter, setFilter] = useState('Fire_Temp')

    const handleFilter = (event) => {
        setAlertFilter(event.target.value);
    };
    const [value, setValue] = React.useState('all');

    const handleValue = (event, newValue) => {
        setValue(newValue);
    };

    // console.log(value)

    const [frameNo, setFrameNo] = useState(0)

    const [GraphName, changeGraphName] = useState('Fire Temperature Graph')


    return (
        <>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar elevation={0} style={{ backgroundColor: 'white' }} position="fixed" open={open}>
                    <Paper elevation={3} style={{ padding: '20px', display: 'flex', margin: '10px', boxShadow: '5px 5px 10px' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 1, ...(open && { display: "none" }) }}
                        >
                            <MenuOpen sx={{ fontSize: '30px !important' }} />
                        </IconButton>
                        <Typography variant="h5" noWrap sx={{ fontWeight: 'bolder', pt: 1, px: 3 }} component="div">
                            {mdBreak ? 'Flame Analytics Dashboard' : null}
                        </Typography>
                        <div style={{ marginLeft: 'auto', display: 'flex' }}>
                            <Button variant="contained" component="label" size="medium" sx={{ px: 3, mx: 1 }} >
                                Upload File
                                <input type="file" hidden accept="video/*,.mkv" onChange={handleChange} />
                            </Button>
                        </div>

                    </Paper>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === "ltr" ? (
                                <ChevronLeftIcon />
                            ) : (
                                <ChevronRightIcon />
                            )}
                        </IconButton>
                    </DrawerHeader>
                    <Drawerr />
                </Drawer>
                <Main open={open} sx={{ pt: 15 }}>
                    {
                        file !== null ?
                            <>
                                <Paper elevation={3} sx={{ p: 2, border: '1px solid', borderRadius: '10px' }}>
                                    <Paper sx={{ p: 2, margin: '10px', boxShadow: '5px 5px 10px' }}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bolder !important', borderRadius: '10px' }}>Live Video Feed Alerts</Typography>
                                        <Typography variant="p" sx={{ color: 'grey !important' }}>Video stream & live notification alerts of the uploaded <b>Infrared Video.</b> The temperature of the fire is considered optimum when the temperature ranges from <b>"495<sup>o</sup>C"</b> to <b>"505<sup>o</sup>C".</b> </Typography>
                                    </Paper>
                                    <Grid container>
                                        <Grid item sm={12} md={6} lg={6}>
                                            <Paper sx={{ p: 2, margin: '10px', borderRadius: '10px', backgroundColor: 'whitesmoke !important' }}>
                                                <Paper elevation={3} sx={{ p: 2 }}>
                                                    <Typography variant='h5' sx={{ fontWeight: 'bolder' }}>Raw Thermal Video</Typography>
                                                    <Typography variant="p" sx={{ color: 'grey !important' }}>Live video stream of the uploaded IR video</Typography>
                                                </Paper>
                                                <video width="100%" height="363 " ref={videoRef} onEnded={() => {
                                                    setShow('flex')
                                                }} controls autoPlay style={{ marginTop: '10px' }}>
                                                    <source src={file} type="video/mp4" />
                                                </video>
                                            </Paper>
                                        </Grid>
                                        <Grid item sm={12} md={3} lg={3}>
                                            <Paper sx={{ p: 2, margin: '10px', borderRadius: '10px', backgroundColor: 'whitesmoke !important' }}>
                                                <Paper elevation={3} sx={{ position: 'sticky', top: 0 }}>
                                                    <Typography variant='h5' sx={{ fontWeight: 'bolder', p: 2, mb: 1 }}>Alerts</Typography>

                                                </Paper>
                                                <Tabs
                                                    value={value}
                                                    onChange={handleValue}
                                                    textColor="secondary"
                                                    aria-label="secondary tabs example"
                                                    TabIndicatorProps={{
                                                        style: {
                                                            display: "none",
                                                        },
                                                    }}
                                                >
                                                    <Tab value="all" icon={<Grading sx={{ color: 'black' }} />} />
                                                    <Tab value="Optimum Threshold" icon={<Avatar variant="square" alt="test avatar" src={fire} sx={{ height: '25px', width: '25px', '&:hover': { backgroundColor: '#d2fcd8', padding: '10px', height: '45px', width: '45px' } }} />} />
                                                    <Tab value="Above Threshold" icon={<ArrowUpward color="warning" sx={{ '&:hover': { backgroundColor: '#FFD580', padding: '10px', height: '45px', width: '45px' } }} />} />
                                                    <Tab value="Below Threshold" icon={<ArrowDownward color="warning" sx={{ '&:hover': { backgroundColor: '#FFFAA0', padding: '10px', height: '45px', width: '45px' } }} />} />
                                                    <Tab value="Non-Fire" icon={<Avatar alt="test avatar" variant="square" src={non_fire} sx={{ height: '40px', width: '40px', '&:hover': { backgroundColor: '#faa0a0', height: '50px', width: '50px' } }} />} />
                                                </Tabs>
                                                <Paper sx={{ maxHeight: '330px !important', overflow: 'auto' }}>
                                                    <>
                                                        {
                                                            allNotifications.map((item) => {
                                                                {/* console.log(item) */ }
                                                                let msgcolor = "#f9a825"
                                                                let cardbgcolor = "#FFFAA0"

                                                                if (item.msg === 'Above Threshold') {
                                                                    msgcolor = '#f9a825'
                                                                    cardbgcolor = '#fffaa0'
                                                                    {/* setAT(prevData => prevData+1) */ }
                                                                }
                                                                else if (item.msg === 'Below Threshold') {
                                                                    msgcolor = '#ff6d00'
                                                                    cardbgcolor = '#ffd580'
                                                                    {/* setBT(prevData => prevData+1) */ }
                                                                }
                                                                else if (item.msg === 'Optimum Threshold') {
                                                                    msgcolor = '#00c853'
                                                                    cardbgcolor = '#c1e1c1'
                                                                    {/* setFire(prevData => prevData+1) */ }
                                                                }
                                                                else if (item.msg === 'Non-Fire') {
                                                                    msgcolor = '#00c853'
                                                                    cardbgcolor = '#c1e1c1'
                                                                    {/* setNonFire(prevData => prevData+1) */ }
                                                                }


                                                                if (value === 'all')
                                                                    return (
                                                                        <>
                                                                            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-around', }}>
                                                                                <Paper elevation={3} sx={{ width: '90%', backgroundColor: `${cardbgcolor}`, borderRadius: '10px' }}>
                                                                                    <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 'bolder', px: 2, py: 1, borderRadius: '10px', color: `${msgcolor}` }}>{item.msg}</Typography>
                                                                                    <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between' }} >
                                                                                        <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Fire Temp : <span>{Math.ceil(item.Fire_Temp)}<sup>o</sup>C</span></Typography>
                                                                                        <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Smoke Temp : <span>{Math.ceil(item.Smoke_Temp)}<sup>o</sup>C</span></Typography>
                                                                                    </Box>
                                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1 }}>
                                                                                        <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Time : <span>{Math.ceil(item.Time)}&nbsp;secs</span></Typography>
                                                                                        <Button sx={{ backgroundColor: '#8e8e8e' }} variant="contained" size="small"
                                                                                            onClick={() => {
                                                                                                setStopNot(!stopNot);
                                                                                                setImagePath(item.Image_Path);
                                                                                                setModalOpen(true);
                                                                                                setFrameNo(item.Frame_no)
                                                                                                setTime(item.Time)
                                                                                                // let imageJSON =
                                                                                                //     JSON.stringify({
                                                                                                //         image_path: item.Image_Path
                                                                                                //     })
                                                                                                // console.log(imageJSON)
                                                                                                try {

                                                                                                    axios.post("http://173.247.237.40:5000/heatmap", {
                                                                                                        image_path: item.Image_Path
                                                                                                    })
                                                                                                        .then((res) => setHeatMapData(res.data[0].image_data))
                                                                                                        .catch((err) => console.log(err))
                                                                                                } catch (e) {
                                                                                                    console.log(e)
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            HeatMap
                                                                                        </Button>
                                                                                    </Box>
                                                                                    {/* <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'center' }} >
                                                                                    </Box> */}
                                                                                </Paper>
                                                                            </Box>
                                                                        </>
                                                                    )
                                                                else {
                                                                    if (value === item.msg)
                                                                        return (
                                                                            <>
                                                                                <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-around', }}>
                                                                                    <Paper elevation={3} sx={{ width: '90%', backgroundColor: `${cardbgcolor}`, borderRadius: '10px' }}>
                                                                                        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 'bolder', px: 2, py: 1, borderRadius: '10px', color: `${msgcolor}` }}>{item.msg}</Typography>
                                                                                        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between' }} >
                                                                                            <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Fire Temp : <span>{Math.ceil(item.Fire_Temp)}<sup>o</sup>C</span></Typography>
                                                                                            <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Smoke Temp : <span>{Math.ceil(item.Smoke_Temp)}<sup>o</sup>C</span></Typography>
                                                                                        </Box>
                                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1 }}>
                                                                                            <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bolder' }}>Time : <span>{Math.ceil(item.Time)}&nbsp;secs</span></Typography>
                                                                                            <Button sx={{ backgroundColor: '#8e8e8e' }} variant="contained" size="small"
                                                                                                onClick={() => {
                                                                                                    setStopNot(!stopNot);
                                                                                                    setImagePath(item.Image_Path);
                                                                                                    setModalOpen(true);
                                                                                                    setFrameNo(item.Frame_no)
                                                                                                    setTime(item.Time)
                                                                                                    // let imageJSON =
                                                                                                    //     JSON.stringify({
                                                                                                    //         image_path: item.Image_Path
                                                                                                    //     })
                                                                                                    // console.log(imageJSON)
                                                                                                    try {

                                                                                                        axios.post("http://173.247.237.40:5000/heatmap", {
                                                                                                            image_path: item.Image_Path
                                                                                                        })
                                                                                                            .then((res) => setHeatMapData(res.data[0].image_data))
                                                                                                            .catch((err) => console.log(err))
                                                                                                    } catch (e) {
                                                                                                        console.log(e)
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                HeatMap
                                                                                            </Button>
                                                                                        </Box>
                                                                                        {/* <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'center' }} >
                                                                                    </Box> */}
                                                                                    </Paper>
                                                                                </Box>
                                                                            </>
                                                                        )
                                                                }

                                                            })
                                                        }
                                                    </>
                                                </Paper>
                                            </Paper>
                                        </Grid>
                                        <Grid item sm={12} md={3} lg={3}>
                                            <Paper sx={{ p: 2, margin: '10px', overflow: 'auto', borderRadius: '10px', backgroundColor: 'whitesmoke !important' }}>
                                                <Paper elevation={3}>
                                                    <Typography variant='h5' sx={{ fontWeight: 'bolder', p: 2, position: 'sticky', bottom: 0, mb: 2 }}>Alert Summary</Typography>
                                                </Paper>
                                                <Box>

                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Paper elevation={3} sx={{ mb: 2, mt: 3, width: '75%', borderRadius: '10px' }}>
                                                            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
                                                                <Avatar alt="Remy Sharp" src={fire} sx={{ height: '30px', width: '30px' }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Fire</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold', color: '#00c853' }}>{fireNotifications.length}</Typography>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Paper elevation={3} sx={{ mb: 2, mt: 1, width: '75%', borderRadius: '10px' }}>
                                                            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
                                                                <Avatar alt="Remy Sharp" src={above} sx={{ height: '30px', width: '30px' }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 'bolder', pl: 3, fontSize: '15px' }}>Above Threshold</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold', color: '#f9a825' }}>{aboveThresholdNotifications.length}</Typography>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Paper elevation={3} sx={{ mb: 2, mt: 1, width: '75%', borderRadius: '10px' }}>
                                                            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
                                                                <Avatar alt="Remy Sharp" src={below} sx={{ height: '30px', width: '30px' }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 'bolder', pl: 3, fontSize: '15px' }}>Below Threshold</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold', color: '#ff6d00' }}>{belowThresholdNotifications.length}</Typography>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Paper elevation={3} sx={{ mb: 2, mt: 1, width: '75%', borderRadius: '10px' }}>
                                                            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
                                                                <Avatar alt="Remy Sharp" src={non_fire} sx={{ height: '30px', width: '30px' }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Non-Fire</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold', color: '#d50000' }}>{nonFireNotifications.length}</Typography>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                <Grid container>
                                    <Grid item md={12} lg={12} sx={{ display: { showProgress }, py: 3 }} >
                                        <LinearProgressWithLabel value={progress} sx={{ padding: '5px !important', margin: '10px', borderRadius: '20px' }} />
                                    </Grid>
                                </Grid>
                            </>
                            :
                            null
                    }
                    <Box sx={{ my: 2, display: `${analysisDisplay}` }}>
                        <Paper elevation={3} sx={{ p: 2, border: '1px solid', borderRadius: '10px' }}>
                            <Paper sx={{ p: 2, margin: '10px', boxShadow: '5px 5px 10px' }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bolder !important', borderRadius: '10px' }}>Video Analytics</Typography>
                            </Paper>
                            {
                                segCurve !== null &&
                                <>
                                    <Grid container>
                                        <Grid item sm={12} md={12} lg={4}>
                                            <Paper elevation={3} sx={{ p: 2, margin: '10px', borderRadius: '10px', backgroundColor: 'whitesmoke !important' }}>
                                                <Box >
                                                    <Paper elevation={3} sx={{ p: 2, borderRadius: '10px' }}>
                                                        <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>Segmentation Video</Typography>
                                                        <Typography variant="p" sx={{ color: 'grey !important' }}>Segmented video seperating the flame(white) and the smoke(grey) with the background eliminated(black).</Typography>
                                                    </Paper>
                                                    <Box sx={{ pt: 2, pl: 1 }}>
                                                        <video width="100%" height="363" controls autoPlay>
                                                            <source src={`http://173.247.237.40:5000/${segCurve[1].Segmentation_Video_Path}`} type="video/mp4" />
                                                        </video>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Paper sx={{ backgroundColor: '#000 !important', minWidth: '370px', marginLeft: '10px', fontSize: '15px !important', display: 'flex', justifyContent: 'center' }}>
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
                                            </Paper>
                                        </Grid>
                                        <Grid item sx={12} md={12} lg={8} >
                                            <Paper elevation={3} sx={{ p: 1, margin: '10px', borderRadius: '10px', backgroundColor: 'whitesmoke !important' }}>
                                                <Box>
                                                    <Paper elevation={3} sx={{ p: 2, margin: '10px', borderRadius: '10px', }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography variant="h5" sx={{ fontWeight: 'bolder !important' }}>
                                                                <i>{GraphName}</i>
                                                            </Typography>

                                                            <FormControl

                                                                sx={{
                                                                    // backgroundColor: "#fff",
                                                                    color: "#8965e0",
                                                                    borderRadius: "5px",
                                                                    borderColor: "#8965e0",
                                                                    hover: {
                                                                        backgroundColor: "",
                                                                    }
                                                                }}
                                                            >
                                                                <InputLabel id="demo-simple-select-label">Curve</InputLabel>
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select-helper"

                                                                    value={filter}
                                                                    // color='#fff'
                                                                    style={{
                                                                        // color: "#8965e0",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                    label="Age"
                                                                    onChange={(e) => {
                                                                        setFilter(e.target.value)
                                                                        if (e.target.value === "Fire_Temp") {
                                                                            setTitleDescription('Time vs Temperature graph of the Flame Temperature across the complete video.')
                                                                            changeGraphName("Fire Temperature Curve")
                                                                        }
                                                                        else if (e.target.value === "Smoke_Temp") {
                                                                            setTitleDescription('Time vs Temperature graph of the Smoke Temperature across the complete video.')
                                                                            changeGraphName("Smoke Temperature Curve")

                                                                        }
                                                                        else if (e.target.value === "Smoke_Percentage") {
                                                                            setTitleDescription('Smoke Percentage Curve across the complete video.')
                                                                            changeGraphName("Smoke Percentage Curve")
                                                                        }
                                                                    }}
                                                                >
                                                                    <MenuItem
                                                                        value="Fire_Temp"
                                                                    >
                                                                        Fire Temperature
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        value="Smoke_Temp"
                                                                    >
                                                                        Smoke Temperature
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        value="Smoke_Percentage"
                                                                    >
                                                                        Smoke Percentage
                                                                    </MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Box>
                                                        <Typography variant="p" sx={{ color: 'grey !important' }}>
                                                            {TitleDescription}
                                                        </Typography>
                                                    </Paper>
                                                    <Box sx={{ margin: '10px', display: 'flex', justifyContent: 'center', pt: 2 }}>
                                                        <ApexChart data={segCurve[0].Curve_Data} filter={filter} />
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </>
                            }

                        </Paper>
                    </Box>
                </Main>
            </Box>
            <Modal
                open={modalOpen}
                sx={{ padding: "20px", margin: "20px" }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Paper
                        elevation={3}
                        sx={{ margin: "0 18px", borderRadius: "10px" }}
                    >
                        <Paper
                            sx={{
                                p: 3,
                                width: "100%",
                                borderRadius: "10px",
                                display: "flex",
                                direction: "row",
                                justifyContent: "space-between",
                                boxShadow: '5px 5px 10px'
                            }}
                        >
                            <Typography variant="h4" sx={{ fontWeight: "bold", }}>
                                {/* Frame Analysis of 10th Frame */}
                                Heatmap of the frame at <i>" {Time} sec"</i>
                            </Typography>
                            <HighlightOff
                                onClick={() => {
                                    setModalOpen(false);
                                    setStopNot(false);
                                    setHeatMapData(null)
                                }}
                                sx={{ cursor: 'pointer' }}
                            />
                        </Paper>
                    </Paper>
                    <Box>
                        <Box>
                            <Grid container spacing={2} sx={{ p: 2, mt: 1 }}>
                                <Grid item sm={12} md={12} lg={6}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 2,
                                            borderRadius: "10px",
                                            backgroundColor: 'whitesmoke !important'
                                        }}
                                    >
                                        <Box>
                                            <Paper
                                                elevation={3}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    sx={{ fontWeight: "bolder" }}
                                                >
                                                    Original Frame
                                                </Typography>
                                                <Typography variant="p" sx={{ fontSize: '12px', fontWeight: 'bolder', color: '#6c757d' }}>
                                                    Raw IR frame of <i>" {Time} sec"</i>
                                                </Typography>
                                            </Paper>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 2, height: '100%' }}>
                                                <img
                                                    src={`http://173.247.237.40:5000/${ImagePath}`}
                                                    alt="original frame"
                                                    width='400px'
                                                    // height='612px'
                                                    style={{
                                                        borderRadius: "20px",
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item sm={12} md={6} lg={6}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 2,
                                            borderRadius: "10px",
                                            backgroundColor: 'whitesmoke !important'
                                        }}
                                    >
                                        <Box sx={{ borderRadius: "10px" }}>
                                            <Paper elevation={3}
                                                sx={{
                                                    p: 2,
                                                    boxShadow: "5px 5px 10px",
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <Typography variant="h5" sx={{ fontWeight: "bolder" }} >
                                                    Heatmap Of Frame
                                                </Typography>
                                                <Typography variant="p" sx={{ fontSize: '12px', fontWeight: 'bolder', color: '#6c757d' }}>
                                                    Pixel-wise heat signature analysis tool representing the temperature at each point on the frame.
                                                </Typography>
                                            </Paper>
                                            <Box sx={{ pt: 2, pl: 1 }}>
                                                {
                                                    heatMapData === null ? <>
                                                        <Box sx={{ display: 'flex',justifyContent:'center',pt:10 }}>
                                                            <CircularProgress />
                                                        </Box>
                                                    </> :
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Heatmap data={heatMapData} width={width} height={height} />
                                                            <Box>
                                                                <List dense={true} sx={{ display: 'flex', flexDirection: 'row' }}>
                                                                    {
                                                                        Object.keys(colorSchema).map((key) => {
                                                                            return (
                                                                                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '10px' }}>
                                                                                    {key}
                                                                                    <div style={{
                                                                                        height: '25px', width: '25px', backgroundColor: colorSchema[`${key}`]
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
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>

                    </Box>
                </Box>
            </Modal>



        </>
    );
}


// {
//     notificationsData.map((item) => {
//         {/* console.log(item) */ }
//         let msgcolor = "#f9a825"
//         let cardbgcolor = "#FFFAA0"

//         if (item.msg === 'Above Threshold') {
//             msgcolor = '#f9a825'
//             cardbgcolor = '#fffaa0'
//             {/* setAT(prevData => prevData+1) */ }
//         }
//         else if (item.msg === 'Below Threshold') {
//             msgcolor = '#ff6d00'
//             cardbgcolor = '#ffd580'
//             {/* setBT(prevData => prevData+1) */ }
//         }
//         else if (item.msg === 'Optimum Threshold') {
//             msgcolor = '#00c853'
//             cardbgcolor = '#c1e1c1'
//             {/* setFire(prevData => prevData+1) */ }
//         }
//         else {
//             msgcolor = '#00c853'
//             cardbgcolor = '#c1e1c1'
//             {/* setNonFire(prevData => prevData+1) */ }
//         }


//         return (
//             <>
//                 <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-around', }}>
//                     <Paper elevation={3} sx={{ width: '90%', backgroundColor: `${cardbgcolor}`, borderRadius: '10px' }}>
//                         <Paper sx={{ fontSize: '18px', fontWeight: 'bolder', textAlign: 'center', p: 1, m: 2, borderRadius: '10px', boxShadow: '5px 5px 10px #000', color: `${msgcolor}` }}>{item.msg}</Paper>
//                         <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-evenly' }} >
//                             <Button>
//                                 <Avatar alt="fire" src={fire1} /><span>{Math.ceil(item.Fire_Temp)}</span>
//                             </Button>
//                             <Button>
//                                 <Avatar alt="fire" src={smoke} />  &ensp; <span>{Math.ceil(item.Smoke_Temp)}</span>
//                             </Button>
//                             <Button>
//                                 <Avatar alt="fire" src={time} sx={{ height: '30px', width: '30px' }} /> &ensp;<span>99</span>
//                             </Button>
//                         </Box>
//                         <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'center' }} >
//                             <Button sx={{ backgroundColor: '#8e8e8e' }} variant="contained" size="small"
//                                 onClick={() => {
//                                     setStopNot(!stopNot);
//                                     setImagePath(item.Image_Path);
//                                     setModalOpen(true);
//                                     let imageJSON =
//                                         JSON.stringify({
//                                             image_path: item.Image_Path
//                                         })
//                                     // console.log(imageJSON)
//                                     try {

//                                         axios.post("http://173.247.237.40:5000/heatmap", {
//                                             image_path: item.Image_Path
//                                         })
//                                             .then((res) => setHeatMapData(res.data[0].image_data))
//                                             .catch((err) => console.log(err))
//                                     } catch (e) {
//                                         console.log(e)
//                                     }
//                                 }}
//                             >
//                                 HeatMap
//                             </Button>
//                         </Box>
//                     </Paper>
//                 </Box>
//             </>
//         )
//     })
// }