import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidenav from '../components/Sidenav';
import OrdersList from './OrdersList';

export default function Orders() {
  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Orders</h1>
          <OrdersList />
        </Box>
      </Box>
    </>
  );
}