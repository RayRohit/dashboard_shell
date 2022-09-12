import React, { useEffect, useRef, useState } from 'react';
import List from '@mui/material/List';
import { Alert, Avatar, Button, Paper, styled, Tooltip, tooltipClasses, Typography, Tabs, Tab } from '@mui/material';
import { Box } from '@mui/system';
import Modall from './Modal/Modal';
import axios from 'axios';
import heat_logo from '../../Images/heatmap.png'

export default function Notifications(props) {
    let [data, setData] = useState([])
    const notify = useRef()
    let same = false
    // useEffect(() => {
    //     const IntervalId = setInterval( () => {
    //         // FrameNo += 1
    //         axios(`http://173.247.237.40:5000/notification`).then((res) => {
    //             console.log(res.data)
    //         }).catch((err) => {
    //             console.log(err)
    //             // clearInterval(IntervalId)
    //         })

    //     }, 1000)

    // }, [])
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

    return (
        <>
            <Paper elevation={3} sx={{ my: 1 }}>
                <Typography variant='h5' sx={{ fontWeight: 'bolder', px: 2, py: 1, position: 'sticky', bottom: 0 }}>Notifications</Typography>
            </Paper>
            <Tabs
                value={"one"}
                // onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="one" label="All" />
                <Tab value="two" label="Fire" />
                <Tab value="three" label="Non-Fire" />
                <Tab value="four" label="Below Threshold" />
            </Tabs>
            <List
                sx={{
                    width: '100%',
                    // maxWidth: 500,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 258,
                    cursor: 'pointer',
                    '& ul': { padding: 0 },
                }}
                subheader={<li />}
            >
                <Box ref={notify}>
                    <BootstrapTooltip title="Lorem Epsum Dummy Content.Lorem Epsum Dummy Content" placement='bottom'>
                        <Alert color='error' sx={{ my: 2 }} action={
                            <Button color="error" variant='contained' size="small" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Avatar alt="Remy Sharp" src={heat_logo} sx={{ width: 30, height: 30 }}/> */}
                                HeatMap
                            </Button>
                        }>
                            <Typography variant='h6' sx={{ fontSize: '12px' }}>Fire</Typography>
                        </Alert>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Lorem Epsum Dummy Content.Lorem Epsum Dummy Content" placement='bottom'>
                        <Alert color='error' sx={{ my: 2 }} action={
                            <Button color="error" variant='contained' size="small" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Avatar alt="Remy Sharp" src={heat_logo} sx={{ width: 30, height: 30 }}/> */}
                                HeatMap
                            </Button>
                        }>
                            <Typography variant='h6' sx={{ fontSize: '12px' }}>Fire</Typography>
                        </Alert>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Lorem Epsum Dummy Content.Lorem Epsum Dummy Content" placement='bottom'>
                        <Alert color='error' sx={{ my: 2 }} action={
                            <Button color="error" variant='contained' size="small" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Avatar alt="Remy Sharp" src={heat_logo} sx={{ width: 30, height: 30 }}/> */}
                                HeatMap
                            </Button>
                        }>
                            <Typography variant='h6' sx={{ fontSize: '12px' }}>Fire</Typography>
                        </Alert>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Lorem Epsum Dummy Content.Lorem Epsum Dummy Content" placement='bottom'>
                        <Alert color='error' sx={{ my: 2 }} action={
                            <Button color="error" variant='contained' size="small" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Avatar alt="Remy Sharp" src={heat_logo} sx={{ width: 30, height: 30 }}/> */}
                                HeatMap
                            </Button>
                        }>
                            <Typography variant='h6' sx={{ fontSize: '12px' }}>Fire</Typography>
                        </Alert>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Lorem Epsum Dummy Content.Lorem Epsum Dummy Content" placement='bottom'>
                        <Alert color='error' sx={{ my: 2 }} action={
                            <Button color="error" variant='contained' size="small" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Avatar alt="Remy Sharp" src={heat_logo} sx={{ width: 30, height: 30 }}/> */}
                                HeatMap
                            </Button>
                        }>
                            <Typography variant='h6' sx={{ fontSize: '12px' }}>Fire</Typography>
                        </Alert>
                    </BootstrapTooltip>
                    {/* {
                        data.map((item) => {
                            return (
                                <>
                                    <Modall title={item.title} ImageData={item} />
                                </>
                            )
                        })
                    } */}
                </Box>
            </List>
        </>
    );
}
