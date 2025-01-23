import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
} from '@mui/material';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setError('');
    try {
      const response = await axios.post('http://localhost:8005/api/admin/login', {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      // Store the JWT token and username/email in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);
      // Redirect to the dashboard or another page
      window.location.href = '/orders';
    } catch (error) {
      //console.error('Login error:', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 12 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>Login</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            variant="outlined"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}