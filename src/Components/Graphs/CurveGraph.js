import React, { useState } from "react";
import Chart from "react-apexcharts";
import Box from "@mui/material/Box";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Paper } from '@mui/material'
import loginImage from '../../Images/LoginBackground.png'

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
export default function CurveGraph(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dataPoint, setDatePoint] = useState(0);
  const series = [
    {
      name: "Temperature",
      data: props.data,
    },
  ];
  const options = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      events: {
        markerClick: function (event, chartContext, { dataPointIndex }) {
          setDatePoint(dataPointIndex + 1);
          handleOpen();
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 5,
      colors: ["#000524"],
      strokeColor: "#00BAEC",
      strokeWidth: 3,
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    colors: ["#fff"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: true,
        gradientToColors: ["#fff"],
        opacityFrom: 1,
        opacityTo: 1,
        type: "vertical",
        stops: [0, 30],
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["#fff"],
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: ["#fff"],
        },
      },
    },
  };
  return (
    <>
      <div id="chart" >
        <Chart options={options} series={series} type="line" height={props.height-10} style={{backgroundColor:'#172b4d', boxShadow: '3px 3px 6px', padding: '5px' }}/>
      </div>
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
            <HighlightOffIcon
              onClick={handleClose}
            />
          </Paper>
          <Typography variant="h6" component="h2">
            {dataPoint}
          </Typography>
          <img src={loginImage} alt='Image-1' width='200px' height='200px' style={{marginTop:'20px'}} />
        </Box>
      </Modal>
    </>
  );
}