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
import { Alert, Avatar, Button, Grid, List, Modal, Paper, Tab, Tabs, Tooltip, tooltipClasses, useMediaQuery, useTheme } from "@mui/material";
import Drawerr from "./Drawer/Drawer";
import { HighlightOff, MenuOpen } from "@mui/icons-material";
import fire from '../../Images/fire.png'
import non_fire from '../../Images/non_fire.jpg'
import threshold from '../../Images/frequency-graph.png'
import axios from "axios";
import LinearProgress from '@mui/material/LinearProgress';
import Graph from "./Graph/Graph";
import video from '../../video.mp4'
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
    borderRadius: "5px",
    overflow: "auto",
};

export default function Dashboard() {
    const theme = useTheme();
    const mdBreak = useMediaQuery(theme.breakpoints.up('lg'));
    const [open, setOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [show, setShow] = useState('none')
    const [showProgress, setShowProgress] = useState('flex')
    const [file, setFile] = useState(null)
    const [analysis,setAnalysis] = useState(true)
    // const [resetNotification, setResetNotification] = useState(false)
    const [imageData, setImageData] = useState({
        ImageData: null,
    })


    const md = useMediaQuery(theme.breakpoints.up('md'))
    const lg = useMediaQuery(theme.breakpoints.up('lg'))
    const xl = useMediaQuery(theme.breakpoints.up('xl'))

    let width = 900
    let height = 500

    if (!md && !lg && !xl) {
        width = 450
        height = 300
    }
    else if (md && !lg && !xl) {
        width = 380
        height = 300
    }
    else if (lg && !md && !xl) {
        width = 600
        height = 500
    }
    else if (!xl && lg && md) {
        width = 570
        height = 500
    }
    else if (xl && lg && md) {
        width = 800
        height = 500
    }
    let array = []
    for (let i = 0; i < 50; i++)
        array.push(
            Math.ceil(Math.random() * i * 10)

        );



    const videoRef = useRef();
    const canvasRef = useRef();
    const [segCurve, setSegData] = useState(null);

    const handleDrawerOpen = () => {
        setOpen(true)
    }
    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (mdBreak) setOpen(mdBreak)
    }, [mdBreak])
    useEffect(() => {
        setFile(file)
    }, [file])


    //      Notification api Call

    const [progress, setProgress] = useState(0);              // setting the Loading of the progress for the response

    const [notifications, setNotifications] = useState(null); // for storing Notifications
    const [stopNot, setStopNot] = useState(true); // for stopping and resuming api calls for Notifications
    const [ImagePath, setImagePath] = useState(null); // for Storing ImagePath
    const [IntervalID, setIntervalId] = useState(null);

    useEffect(() => {
        if (stopNot) {
            clearInterval(IntervalID);
        }
        else {
            const newIntervalID = setInterval(() => {
                try {
                    axios
                        .get("http://173.247.237.40:5000/notification")
                        .then((res) => {
                            console.log(notifications)
                            // setNotifications(prevData => [...Object.values(res.data),...notifications]);
                            setNotifications(prevData => [...Object.values(res.data)]);   // 
                            // console.log(Object.values(res.data));
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    console.log("Call");
                } catch (e) {
                    console.log(e);
                }
                setIntervalId(newIntervalID);
            }, 1000);
        }
    }, [stopNot]);

    //   Handling the Uplaoding of the Video

    const handleChange = (e) => {
        console.log(e.target.files[0]);                                       // video File
        const formData = new FormData();
        if (e.target && e.target.files[0]) {
            formData.append("videos", e.target.files[0]);
            setStopNot(false);
            axios
                .post("http://173.247.237.40:5000/uploadvideo", formData)
                .then((res) => {
                    setSegData(res.data);
                })
                .catch((err) => console.log(err));
        }

        // if(setSegData !== null) setShowProgress('none')
        // else{
        //     if(progress < 90) setProgress((prevProgress) => (prevProgress >= 100 ? setShowProgress('none') : prevProgress + 10));
        // }

        setFile(URL.createObjectURL(e.target.files[0]));
        videoRef.current?.load();
    };




    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? setShowProgress('none') : prevProgress + 10));
        }, 2000);
        return () => {
            clearInterval(timer);
        };
    }, [showProgress]);

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
    const [value, setValue] = React.useState('one');
    const handleValue = (event, newValue) => {
        setValue(newValue);
    };
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
                    <Paper elevation={3} sx={{ p: 2, border: '1px solid' }}>
                        <Paper sx={{ p: 2, margin: '10px', boxShadow: '5px 5px 10px' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bolder !important' }}>Live Video Feed Alerts</Typography>
                        </Paper>
                        <Grid container>
                            {
                                file !== null ?
                                    <>
                                        <Grid item sm={12} md={6} lg={6}>
                                            <Paper sx={{ p: 2, boxShadow: '5px 5px 10px', margin: '10px' }}>
                                                <Paper elevation={3}>
                                                    <Typography variant='h5' sx={{ fontWeight: 'bolder', p: 2, position: 'sticky', bottom: 0, mb: 2 }}>Raw Thermal Video</Typography>
                                                </Paper>
                                                <video width="100%" height="363 " ref={videoRef} onEnded={() => {
                                                    setShow('flex')
                                                }} controls autoPlay>
                                                    <source src={file} type="video/mp4" />
                                                </video>
                                            </Paper>
                                        </Grid>
                                        <Grid itemsm={12} md={3} lg={3}>
                                            <Paper sx={{ p: 2, boxShadow: '5px 5px 10px', margin: '10px', maxHeight: '482px !important', overflow: 'auto' }}>
                                                <Paper elevation={3} sx={{ position: 'sticky', top: 0 }}>
                                                    <Typography variant='h5' sx={{ fontWeight: 'bolder', p: 2, mb: 1 }}>Alerts</Typography>
                                                </Paper>
                                                <Paper>
                                                    <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-around' }}>
                                                        <Paper elevation={3} sx={{ width: '80%', backgroundColor: '#b1dd9e' }}>
                                                            <Paper sx={{ fontSize: '18px', fontWeight: 'bolder', textAlign: 'center', p: 1, m: 2, borderRadius: '10px', boxShadow: '5px 5px 10px #000', color: '#1a8a0d' }}>Fire Found </Paper>
                                                            <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between' }} >
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Fire Temp :</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Smoke Temp:</Typography>
                                                            </Box>
                                                            <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between' }} >
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Time :</Typography>
                                                                <Button sx={{ backgroundColor: '#8e8e8e' }} variant="contained" size="small"  >
                                                                    HeatMap
                                                                </Button>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-around' }}>
                                                        <Paper elevation={3} sx={{ width: '80%', backgroundColor: '#f69697' }}>
                                                            <Paper sx={{ fontSize: '18px', fontWeight: 'bolder', textAlign: 'center', p: 1, m: 2, borderRadius: '10px', boxShadow: '5px 5px 10px #000', color: '#d50000' }}>Fire Not Found </Paper>
                                                            <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between' }} >
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Fire Temp :</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Smoke Temp:</Typography>
                                                            </Box>
                                                            <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between' }} >
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Time :</Typography>
                                                                <Button sx={{ backgroundColor: '#8e8e8e' }} variant="contained" size="small"  >
                                                                    HeatMap
                                                                </Button>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-around' }}>
                                                        <Paper elevation={3} sx={{ width: '80%', backgroundColor: '#fdfd96' }}>
                                                            <Paper sx={{ fontSize: '18px', fontWeight: 'bolder', textAlign: 'center', p: 1, m: 2, borderRadius: '10px', boxShadow: '5px 5px 10px #000', color: '#f9a825' }}>Fire Above Limit </Paper>
                                                            <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between' }} >
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Fire Temp :</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Smoke Temp:</Typography>
                                                            </Box>
                                                            <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between' }} >
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Time :</Typography>
                                                                <Button sx={{ backgroundColor: '#8e8e8e' }} variant="contained" size="small"  >
                                                                    HeatMap
                                                                </Button>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-around' }}>
                                                        <Paper elevation={3} sx={{ width: '80%', backgroundColor: '#ff964f' }}>
                                                            <Paper sx={{ fontSize: '18px', fontWeight: 'bolder', textAlign: 'center', p: 1, m: 2, borderRadius: '10px', boxShadow: '5px 5px 10px #000', color: '#ff6d00' }}>Fire Below Limit </Paper>
                                                            <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between' }} >
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Fire Temp :</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Smoke Temp:</Typography>
                                                            </Box>
                                                            <Box sx={{ px: 2, py: 2, display: 'flex', justifyContent: 'space-between' }} >
                                                                <Typography variant="h6" sx={{ fontSize: '15px' }}>Time :</Typography>
                                                                <Button sx={{ backgroundColor: '#8e8e8e' }} variant="contained" size="small"  >
                                                                    HeatMap
                                                                </Button>
                                                            </Box>
                                                        </Paper>
                                                    </Box>



                                                </Paper>
                                            </Paper>
                                        </Grid>
                                        <Grid item sm={12} md={3} lg={3}>
                                            <Paper sx={{ p: 2, boxShadow: '5px 5px 10px', margin: '10px', overflow: 'auto' }}>
                                                <Paper elevation={3}>
                                                    <Typography variant='h5' sx={{ fontWeight: 'bolder', p: 2, position: 'sticky', bottom: 0, mb: 2 }}>Alert Summary</Typography>
                                                </Paper>
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Paper elevation={3} sx={{ mb: 2, mt: 3, width: '75%', borderRadius: '10px' }}>
                                                            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
                                                                <Avatar alt="Remy Sharp" src={fire} sx={{ height: '30px', width: '30px' }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Fire</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold', color: '#00c853' }}>99</Typography>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Paper elevation={3} sx={{ mb: 2, mt: 1, width: '75%', borderRadius: '10px' }}>
                                                            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
                                                                <Avatar alt="Remy Sharp" src={threshold} sx={{ height: '30px', width: '30px' }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 'bolder', pl: 3, fontSize: '15px' }}>Above Threshold</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold', color: '#f9a825' }}>99</Typography>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Paper elevation={3} sx={{ mb: 2, mt: 1, width: '75%', borderRadius: '10px' }}>
                                                            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
                                                                <Avatar alt="Remy Sharp" src={threshold} sx={{ height: '30px', width: '30px' }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 'bolder', pl: 3, fontSize: '15px' }}>Below Threshold</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold', color: '#ff6d00' }}>99</Typography>
                                                            </Box>
                                                        </Paper>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Paper elevation={3} sx={{ mb: 2, mt: 1, width: '75%', borderRadius: '10px' }}>
                                                            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between' }}>
                                                                <Avatar alt="Remy Sharp" src={non_fire} sx={{ height: '30px', width: '30px' }} />
                                                                <Typography variant="h6" sx={{ fontWeight: 'bolder', fontSize: '15px' }}>Non-Fire</Typography>
                                                                <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 'bold', color: '#d50000' }}>99</Typography>
                                                            </Box>
                                                        </Paper>
                                                    </Box>


                                                </Box>
                                            </Paper>
                                        </Grid>
                                        {/* <Grid item sm={12} md={5} lg={5}>
                                        <Paper sx={{ p: 2, boxShadow: '5px 5px 10px', margin: '10px' }}>
                                            <Paper elevation={3} >
                                                <Typography variant='h5' sx={{ fontWeight: 'bolder', p: 2, position: 'sticky', bottom: 0 }}>Notifications</Typography>
                                            </Paper>
                                            <Paper elevation={3} sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', p: 2 ,justifyContent:'space-around'}}>
                                                    <Paper elevation={3} >
                                                        <Box sx={{ display: 'flex', p: 2 }}>
                                                            <Avatar alt="Remy Sharp" src={fire} sx={{ height: '30px', width: '30px' }} />
                                                            <Typography variant="h6" sx={{ fontWeight: 'bolder', pl: 3 }}>Fire</Typography>
                                                        </Box>
                                                        <Typography variant="h6" sx={{ fontSize: '15px', px: 3 }}>Count :</Typography>
                                                    </Paper>
                                                    <Paper elevation={3} >
                                                        <Box sx={{ display: 'flex', p: 2 }}>
                                                            <Avatar alt="Remy Sharp" src={fire} sx={{ height: '30px', width: '30px' }} />
                                                            <Typography variant="h6" sx={{ fontWeight: 'bolder', pl: 3 }}>Fire</Typography>
                                                        </Box>
                                                        <Typography variant="h6" sx={{ fontSize: '15px', px: 3 }}>Count :</Typography>
                                                    </Paper>
                                                    <Paper elevation={3} >
                                                        <Box sx={{ display: 'flex', p: 2 }}>
                                                            <Avatar alt="Remy Sharp" src={fire} sx={{ height: '30px', width: '30px' }} />
                                                            <Typography variant="h6" sx={{ fontWeight: 'bolder', pl: 3 }}>Fire</Typography>
                                                        </Box>
                                                        <Typography variant="h6" sx={{ fontSize: '15px', px: 3 }}>Count :</Typography>
                                                    </Paper>
                                                </Box>
                                            </Paper>
                                            <Box sx={{ overflow: 'auto', textAlign: 'center' }}>
                                                <Tabs
                                                    value={value}
                                                    onChange={handleValue}
                                                    textColor="secondary"
                                                    indicatorColor="secondary"
                                                    aria-label="secondary tabs example"
                                                >
                                                    <Tab value="one" label="All" />
                                                    <Tab value="two" label="Fire" />
                                                    <Tab value="three" label="Non-Fire" />
                                                    <Tab value="four" label=">=Threshold" />
                                                </Tabs>
                                            </Box>
                                            <List
                                                sx={{
                                                    width: '100%',
                                                    bgcolor: 'background.paper',
                                                    position: 'relative',
                                                    overflow: 'auto',
                                                    maxHeight: 210,
                                                    cursor: 'pointer',
                                                    '& ul': { padding: 0 },
                                                }}
                                                subheader={<li />}
                                            >
                                                <Box>
                                                    {notifications !== null && (
                                                        <>
                                                            {notifications.map((item) => {
                                                                { console.log(item) }
                                                                return (
                                                                    <>
                                                                        <Alert color='error' sx={{ my: 2 }} action={
                                                                            <Button color="error" variant='contained' size="small"
                                                                                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                                                onClick={() => {
                                                                                    setStopNot(!stopNot);
                                                                                    setImagePath(item[1]);
                                                                                    setModalOpen(true);
                                                                                }}>
                                                                                HeatMap
                                                                            </Button>
                                                                        }>
                                                                            <Typography variant='h6' sx={{ fontSize: '12px' }}>{item[0]}</Typography>
                                                                        </Alert>
                                                                    </>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                                </Box>
                                            </List>

                                        </Paper>
                                    </Grid> */}

                                    </>
                                    :
                                    null
                            }
                        </Grid>
                    </Paper>
                    {
                        
                    }
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
                        sx={{ margin: "0 18px", borderRadius: "20px" }}
                    >
                        <Paper
                            sx={{
                                p: 3,
                                width: "100%",
                                borderRadius: "20px",
                                display: "flex",
                                direction: "row",
                                justifyContent: "space-between",

                            }}
                        >
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                {/* Frame Analysis of 10th Frame */}
                                Notification Analysis
                            </Typography>
                            <HighlightOff
                                onClick={() => {
                                    setModalOpen(false);
                                    setStopNot(false);
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
                                            boxShadow: "5px 5px 10px",
                                            borderRadius: "20px",
                                        }}
                                    >
                                        <Box>
                                            <Paper
                                                elevation={3}
                                                sx={{
                                                    p: 2,
                                                    boxShadow: "5px 5px 10px",
                                                    borderRadius: "10px",
                                                    backgroundColor: 'whitesmoke !important'
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    sx={{ fontWeight: "bolder" }}
                                                >
                                                    Original Frame
                                                </Typography>
                                                <Typography variant="p" sx={{ fontSize: '12px', fontWeight: 'bolder', color: '#6c757d' }}>
                                                    Raw IR frame of _____sec / ____frame
                                                </Typography>
                                            </Paper>
                                            <Box sx={{ textAlign: 'center', pt: 2 }}>
                                                <img
                                                    src={`http://173.247.237.40:5000/${ImagePath}`}
                                                    alt="original frame"
                                                    width='55%'
                                                    style={{
                                                        boxShadow: "3px 3px 6px",
                                                        borderRadius: "20px",
                                                        padding: "5px",
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
                                            boxShadow: "5px 5px 10px",
                                            borderRadius: "20px",
                                        }}
                                    >
                                        <Box sx={{ borderRadius: "20px" }}>
                                            <Paper elevation={3}
                                                sx={{
                                                    p: 2,
                                                    boxShadow: "5px 5px 10px",
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <Typography variant="h5" sx={{ fontWeight: "bolder" }} >
                                                    HeatMap Of Frame
                                                </Typography>
                                            </Paper>
                                            <Box sx={{ pt: 2, pl: 1 }}>
                                                <img
                                                    src=""
                                                    alt="original frame"
                                                    style={{
                                                        boxShadow: "3px 3px 6px",
                                                        borderRadius: "20px",
                                                        padding: "5px",
                                                    }}
                                                />
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