import { Paper } from '@mui/material'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Components/Dashboard/Dashboard'
import Login from './Components/Login/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
      <>
        <Paper

          sx={{

            // position: "relative",

            //   bottom: 0,

            //   left: 0,

            //   right: 0,

            p: 1,

            color: "grey !important",

            //   "&:hover": { color: "#0275d8 !important" },

            marginTop: "auto",

            width: "100%",
            position : "fixed",
            bottom:0

          }}

          elevation={3}

        >

          2022 ©{" "}

          <a

            href="https://navajna.com/"

            style={{

              textDecoration: "none",

              color: "grey",

              "&:hover": { color: "#0275d8 !important" },

            }}

          >

            navAjna Technologies Pvt. Ltd

          </a>

        </Paper>
      </>
    </BrowserRouter>
  )
}

