import { Box, Paper } from '@mui/material'
import React from 'react'
import GraphDropdown from './GraphDropdown'

export default function Graph() {
    return (
        <>
            <Box>
                <Paper elevation={3} sx={{ p: 2, boxShadow: '5px 5px 10px' }}>
                    <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                        <GraphDropdown />
                    </Box>
                </Paper>
            </Box>
        </>
    )
}
