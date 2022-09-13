import { Alert, Button, Grid, Modal, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
// import { AppContext } from "./Components/AppContext/GlobalState";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
export default function NotificationsCopy() {
  // const { notifications } = useContext(AppContext);
  // console.log(notifications)
  const [segCurve, setSegData] = useState(null);
  const [notifications, setNotifications] = useState(null); // for storing Notifications
  const [stopNot, setStopNot] = useState(true); // for stopping and resuming api calls for Notifications
  const [ImagePath, setImagePath] = useState(null); // for Storing ImagePath
  const [file, setFile] = useState(null);
  const videoRef = useRef();
  const handleChange = (e) => {
    console.log(e.target.files[0]);
    const formData = new FormData();
    if (e.target && e.target.files[0]) {
      formData.append("videos", e.target.files[0]);
      setStopNot(false);
      axios
        .post("http://173.247.237.40:5000/uploadvideo", formData)
        .then((res) => {
          console.log(res.data);
          setSegData(res.data);
        })
        .catch((err) => console.log(err));
    }
    setFile(URL.createObjectURL(e.target.files[0]));
    videoRef.current?.load();
  };
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
  ///
  // console.log(notifications);
  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Button variant="contained" component="label">
            Upload
            <input
              type="file"
              hidden
              accept="video/*,.mkv"
              onChange={handleChange}
            />
          </Button>
        </Grid>
        <Grid item sm={12} md={7} lg={7}>
          <Paper sx={{ p: 2, boxShadow: "5px 5px 10px", margin: "10px" }}>
            <video width="100%" height="363 " ref={videoRef} controls autoPlay>
              <source src={file} type="video/mp4" />
            </video>
          </Paper>
        </Grid>
        <Grid
          item
          sm={12}
          md={5}
          lg={5}
          sx={{ height: "40vh", overflow: "auto" }}
        >
          <Paper sx={{ p: 2, boxShadow: "5px 5px 10px", margin: "10px" }}>
            {notifications !== null && (
              <>
                {notifications.map((item) => {
                  // console.log(item);
                  return (
                    <>
                      <Alert
                        color="error"
                        sx={{ my: 2 }}
                        action={
                          <Button
                            color="error"
                            variant="contained"
                            size="small"
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onClick={() => {
                              setStopNot(!stopNot);
                              setImagePath(item[1]);
                              setOpen(true);
                            }}
                          >
                            {/* <Avatar alt="Remy Sharp" src={heat_logo} sx={{ width: 30, height: 30 }}/> */}
                            HeatMap
                          </Button>
                        }
                      >
                        <Typography variant="h6" sx={{ fontSize: "12px" }}>
                          {item[0]}
                        </Typography>
                      </Alert>
                    </>
                  );
                })}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
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
                <HighlightOffIcon
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
    </>
  );
}