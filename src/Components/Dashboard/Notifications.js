import React, { useEffect, useRef, useState } from 'react';
import List from '@mui/material/List';
import { Alert, Avatar, Button, Paper, styled, Tooltip, tooltipClasses, Typography, Tabs, Tab, Grid, Modal } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { HighlightOff } from '@mui/icons-material';

export default function Notifications(props) {
    let [data, setData] = useState([])
    const [notifications, setNotifications] = useState(null); // for storing Notifications
    const [stopNot, setStopNot] = useState(true); // for stopping and resuming api calls for Notifications
    const [ImagePath, setImagePath] = useState(null); // for Storing ImagePath
    const [file, setFile] = useState(null);
    const videoRef = useRef();
    const [segCurve, setSegData] = useState(null);
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        boxShadow: "10px 5px 10px #222",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: "5px",
        overflow: "auto",
    };
    const [open, setOpen] = useState(false);
    ///   Stop Watch for Notifications
    const [IntervalID, setIntervalId] = useState(null);
    useEffect(() => {
        if (stopNot) {
            // console.log(IntervalID)
            clearInterval(IntervalID);
        } else {
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
    const notify = useRef()
    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.common.black,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.common.black,
            width: '350px',
            height: '50px'
        },
    }));
    const [value, setValue] = React.useState('one');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    useEffect(() => {
        if (stopNot) {
            // console.log(IntervalID)
            clearInterval(IntervalID);
        } else {
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

    return (
        <>
            <Paper elevation={3} sx={{ my: 1 }}>
                <Typography variant='h5' sx={{ fontWeight: 'bolder', p: 2, position: 'sticky', bottom: 0 }}>Notifications</Typography>
            </Paper>
            <Box sx={{ overflow: 'auto', textAlign: 'center' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
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
                    // maxWidth: 500,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 242,
                    cursor: 'pointer',
                    '& ul': { padding: 0 },
                }}
                subheader={<li />}
            >
                <Box ref={notify}>
                    {notifications !== null && (
                        <>
                            {notifications.map((item) => {
                                return (
                                    <>

                                        <BootstrapTooltip title="Lorem Epsum Dummy Content.Lorem Epsum Dummy Content" placement='bottom'>
                                            <Alert color='error' sx={{ my: 2 }} action={
                                                <Button color="error" variant='contained' size="small" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => {
                                                    setStopNot(!stopNot);
                                                    setImagePath(item[1]);
                                                    setOpen(true);
                                                }}>
                                                    HeatMap
                                                </Button>
                                            }>
                                                <Typography variant='h6' sx={{ fontSize: '12px' }}>{item[0]}</Typography>
                                            </Alert>
                                        </BootstrapTooltip>
                                    </>
                                );
                            })}
                        </>
                    )}
                    <Modal
                        open={open}
                        sx={{ padding: "20px", margin: "20px" }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Paper
                                sx={{ p: 2, margin: "10px", boxShadow: "5px 5px 10px", mb: 2 }}
                            >
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
                                            backgroundColor: "",
                                        }}
                                    >
                                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                            {/* Frame Analysis of 10th Frame */}
                                        </Typography>
                                        <HighlightOff
                                            onClick={() => {
                                                setOpen(false);
                                                setStopNot(false);
                                            }}
                                        />
                                    </Paper>
                                </Paper>
                                <Box>
                                    <Box>
                                        <Grid container spacing={2} sx={{ p: 2, mt: 1 }}>
                                            <Grid item sm={12} md={6} lg={6}>
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
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h5"
                                                                sx={{ fontWeight: "bolder" }}
                                                            >
                                                                Original Frame
                                                            </Typography>
                                                        </Paper>
                                                        <Box sx={{ pt: 2, pl: 1 }}>
                                                            <img
                                                                src={`http://173.247.237.40:5000/${ImagePath}`}
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
                                    <Box>
                                        <Grid container spacing={2} sx={{ p: 2 }}>
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
                                                        <Paper
                                                            elevation={3}
                                                            sx={{
                                                                p: 2,
                                                                boxShadow: "5px 5px 10px",
                                                                borderRadius: "10px",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h5"
                                                                sx={{ fontWeight: "bolder" }}
                                                            >
                                                                Segmented Frame
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
                            </Paper>
                        </Box>
                    </Modal>
                    {/* <BootstrapTooltip title="Lorem Epsum Dummy Content.Lorem Epsum Dummy Content" placement='bottom'>
                        <Alert color='error' sx={{ my: 2 }} action={
                            <Button color="error" variant='contained' size="small" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                HeatMap
                            </Button>
                        }>
                            <Typography variant='h6' sx={{ fontSize: '12px' }}>Fire</Typography>
                        </Alert>
                    </BootstrapTooltip> */}
                </Box>
            </List>
        </>
    );
}
