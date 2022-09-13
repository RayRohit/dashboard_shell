import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

export default function GraphDropdown() {
  const [graph, setGraph] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setGraph(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-controlled-open-select-label">Curve Graphs</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={graph}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Flame Temperature Curve</MenuItem>
          <MenuItem value={20}>Smoke Temperature Curve</MenuItem>
          <MenuItem value={30}>Smoke Percentage Curve</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
