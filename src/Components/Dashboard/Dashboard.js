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
import { Button, Grid, Paper, useMediaQuery, useTheme } from "@mui/material";
import Drawerr from "./Drawer/Drawer";
import { MenuOpen } from "@mui/icons-material";
import Notifications from "./Notifications";
import Modall from "./Modal/Modal";
import video from '../../video.mp4'
import CurveGraph from "../Graphs/CurveGraph";
import axios from "axios";
import LinearProgress from '@mui/material/LinearProgress';

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

export default function Dashboard() {
    const theme = useTheme();
    const mdBreak = useMediaQuery(theme.breakpoints.up('lg'));
    const [open, setOpen] = React.useState(false);
    const [show, setShow] = useState('none')
    const [showProgress, setShowProgress] = useState('flex')
    const [file, setFile] = useState(null)
    const [resetNotification, setResetNotification] = useState(false)
    const [imageData, setImageData] = useState({
        ImageData: null,
    })

    const [Notification, setNotifications] = useState([])


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

    const handleDrawerOpen = () => {
        setOpen(true)
    }
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleChange = (e) => {
        console.log(e.target.files[0])


        const videoElem = e.target.files[0]

        const formData = new FormData()

        if (e.target && e.target.files[0]) {
            formData.append('videos', e.target.files[0])
            axios.post('http://173.247.237.40:5000/uploadvideo', formData).then((res) => console.log(res.data)).catch((err) => console.log(err))
        }

        setFile(URL.createObjectURL(e.target.files[0]))
        videoRef.current?.load();
        setResetNotification(true)
        setShow('none')
        setShowProgress('flex')
        setProgress(10)
    }
    useEffect(() => {
        if (mdBreak) setOpen(mdBreak)
    }, [mdBreak])
    useEffect(() => {
        setFile(file)
    }, [file])

    // const capture = async () => {
    //     const v = videoRef.current;
    //     canvasRef.current.width = videoRef.current.videoWidth;
    //     canvasRef.current.height = videoRef.current.videoHeight;
    //     canvasRef.current
    //         .getContext("2d")
    //         .drawImage(
    //             videoRef.current,
    //             0,
    //             0,
    //             videoRef.current.videoWidth,
    //             videoRef.current.videoHeight
    //         );
    //     const newCanvas = document.createElement("canvas");
    //     const newCtx = newCanvas.getContext("2d");
    //     newCtx.drawImage(
    //         videoRef.current,
    //         0,
    //         0,
    //         videoRef.current.videoWidth,
    //         videoRef.current.videoHeight
    //     );
    //     let imageData = newCtx.getImageData(
    //         0,
    //         0,
    //         newCanvas.width,
    //         newCanvas.height
    //     )


    // const base64ArrayBuffer = async (data) => {
    //     const base64url = await new Promise((r) => {
    //         const reader = new FileReader()
    //         reader.onload = () => r(reader.result);
    //         reader.readAsDataURL(new Blob([data]))
    //     })
    //     return base64url.split(",", 2)[1]
    // }

    // const base64ImageData = await base64ArrayBuffer(new Uint8Array(imageData.data))

    // console.log(imageData.data)
    // console.log(base64ImageData)

    // const obj = {
    //     image: base64ImageData
    // }

    // const jsonData = JSON.stringify(obj)
    // console.log(jsonData)
    // console.log(base64ImageData.length)

    // axios.post("http://localhost:3000/ImageData",jsonData).then((res) => console.log(res.data)).catch((err) => console.log(err))


    // };

    // function ResetNotify(data) {
    //     console.log(Notification)
    //     setNotifications(prevData => [...prevData, data])
    // }

    const [progress, setProgress] = React.useState(0);

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

    // LinearProgressWithLabel.propTypes = {
    //     /**
    //      * The value of the progress indicator for the determinate and buffer variants.
    //      * Value between 0 and 100.
    //      */
    //     value: PropTypes.number.isRequired,
    // };
    // onPause={capture}
    return (
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
                <Grid container>
                    {
                        file !== null ?
                            <>
                                <Grid item sm={12} md={7} lg={7}>
                                    <Paper sx={{ p: 2, boxShadow: '5px 5px 10px', margin: '10px' }}>
                                        <video width="100%" height="363 " ref={videoRef} onEnded={() => {
                                            setShow('flex')
                                        }} controls autoPlay>
                                            <source src={file} type="video/mp4" />
                                        </video>
                                    </Paper>
                                </Grid>
                                {/* <Grid item sm={12} md={6} lg={8} sx={{ display: 'none' }}>
                                    <Paper sx={{ p: 2, boxShadow: '5px 5px 10px', margin: '10px' }}>
                                        <canvas id='canvas' ref={canvasRef} style={{ overflow: 'auto' }}>

                                        </canvas>
                                    </Paper>
                                </Grid> */}
                                <Grid item sm={12} md={5} lg={5}>
                                    <Paper sx={{ p: 2, boxShadow: '5px 5px 10px', margin: '10px' }}>
                                        <Notifications />
                                    </Paper>
                                </Grid>
                                {/* <Grid item sm={12} md={6} lg={6}>
                                    <Paper sx={{ p: 2, boxShadow: '5px 5px 10px', margin: '10px' }}>
                                        <Notifications />
                                    </Paper>
                                </Grid> */}
                                <Box sx={{ width: '100%', m: 2 }}>
                                    {/* <LinearProgress value={progress} /> */}
                                    <LinearProgressWithLabel value={progress} sx={{ borderRadius: '20px', padding: '5px' }} />
                                </Box>
                                {/* <Grid container spacing={2} sx={{ p: 2, mt: 1, display: `${show}` }}>
                                    <Grid item sm={12} md={6} lg={6}>
                                        <Paper elevation={3} sx={{ p: 2, boxShadow: '5px 5px 10px', borderRadius: '20px', }}>
                                            <Box >
                                                <Paper elevation={3} sx={{ p: 2, boxShadow: '5px 5px 10px', borderRadius: '10px' }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>Segmentation Video</Typography>
                                                </Paper>
                                                <Box sx={{ pt: 2, pl: 1 }}>
                                                    <video width="100%" height="363" controls autoPlay>
                                                        <source src={video} type="video/mp4" />
                                                    </video>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                    <Grid item sm={12} md={6} lg={6} >
                                        <Paper elevation={3} sx={{ p: 2, boxShadow: '5px 5px 10px', borderRadius: '20px' }}>
                                            <Box sx={{ borderRadius: '20px' }}>
                                                <Paper elevation={3} sx={{ p: 2, boxShadow: '5px 5px 10px', borderRadius: '10px' }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bolder' }} >Heat Signature Video</Typography>
                                                </Paper>
                                                <Box sx={{ textAlign: 'center', pt: 2 }}>
                                                    <video width="100%" height="363 " controls autoPlay>
                                                        <source src={file} type="video/mp4" />
                                                    </video>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                    <Grid item sm={12} md={6} lg={6}>
                                        <Paper elevation={3} sx={{ p: 2, boxShadow: '5px 5px 10px', borderRadius: '20px', }}>
                                            <Box sx={{ borderRadius: '20px' }}>
                                                <Paper elevation={3} sx={{ p: 2, boxShadow: '5px 5px 10px', borderRadius: '10px' }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bolder' }}>Notification Summary</Typography>
                                                </Paper>
                                                <Box sx={{ textAlign: 'center', pt: 2 }}>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                    <Grid item sm={12} md={6} lg={6} >
                                        <Paper elevation={3} sx={{ p: 2, boxShadow: '5px 5px 10px', borderRadius: '20px' }}>
                                            <Box >
                                                <Paper elevation={3} sx={{ p: 2, boxShadow: '5px 5px 10px', borderRadius: '10px' }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bolder' }} >Prediction Curve</Typography>
                                                </Paper>
                                                <Box sx={{ textAlign: 'center', pt: 4 }}>
                                                    <CurveGraph data={array} height={height} width={width} />
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid> 


                                </Grid> */}
                            </>
                            :
                            null
                    }
                </Grid>
            </Main>
        </Box>
    );
}