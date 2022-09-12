import React from "react";
import { Box, Button, Grid} from "@mui/material";
import { Logout } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
export default function Drawerr() {

  // const navigate = useNavigate()

  return (
    <>
    {/* onClick={() => navigate('/', { replace: true })} */}
      <Grid row={1} sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'end' }}>
        <Grid columns={12}>
          <Box sx={{ py: 2 }}>
            <Button variant="contained"  endIcon={<Logout sx={{ fontSize: '15px !important' }} />}>Logout</Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}