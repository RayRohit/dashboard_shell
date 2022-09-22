import React, { useState } from 'react';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Avatar, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../Images/LoginBackground.png'
import user from '../../Images/user.png'

const theme = createTheme();
export default function Login() {
    const [passwordType, setPasswordType] = useState('password')

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formData = {
            ...{
                email: data.get('email'),
                password: data.get('password')
            }
        }
        try {

            // axios.get(`http://localhost:3000/Users?email=${formData.email}&&password=${formData.password}`).then((res) => {
            //     if ((res.data).length === 1) navigate('/dashboard', { replace: true })
            // }).catch((err) => console.log(err))
            if(formData.email ==="admin@navajna.com" && formData.password === 'admin@1234') navigate('/dashboard',{replace:true})

        } catch (e) {
            console.log(e)
        }

    };
    function handleToggle() {
        if (passwordType === 'password') setPasswordType('text')
        else setPasswordType('password')
    }
    // sx={{ backgroundImage: `url(${LoginImage})` }}
    return (
        <ThemeProvider theme={theme}>
            <Box >                                   
                <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CssBaseline />
                    <Paper elevation={3} sx={{ p: 4, boxShadow: '7px 7px 14px',borderRadius:'20px' }} >
                        <Box>
                            <Box sx={{display:'flex',justifyContent:'center'}}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src={user}
                                    sx={{ width:65, height:65 }}
                                />
                            </Box>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ py: 3 }}>
                                <Grid container spacing={2}>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type={passwordType}
                                            id="password"
                                            autoComplete="new-password"
                                            InputProps={{ endAdornment: <Button variant='text' onClick={handleToggle} >{passwordType === 'password' ? <VisibilityIcon /> : <VisibilityOffIcon />}</Button> }}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3 }}
                                >
                                    Sign In
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}