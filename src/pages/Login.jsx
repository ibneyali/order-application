import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForgotPasswordChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8005/api/admin/forgot-password', null, {
        params: { email },
      });
      setForgotPasswordOpen(false); // Close the modal first
      setMessage('Password reset link has been sent to your email.');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = formData;
    setError('');
    try {
      const response = await axios.post('http://localhost:8005/api/admin/login', {
        identifier,
        password,
      });
      console.log('Login successful:', response.data);
      // Store the JWT token and identifier in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('identifier', identifier);
      // Redirect to the dashboard or another page
      window.location.href = '/orders';
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
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
            label="Username or Email"
            name="identifier"
            variant="outlined"
            margin="normal"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            variant="outlined"
            margin="normal"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
          {message && <Typography color="primary" sx={{ mt: 2 }}>{message}</Typography>} {/* Display message below Login button */}
          <Link href="#" variant="body2" onClick={handleForgotPasswordOpen}>
            Forgot password?
          </Link>
        </Box>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <Dialog open={forgotPasswordOpen} onClose={handleForgotPasswordClose}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your email address to receive a password reset link.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={handleForgotPasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleForgotPasswordClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleForgotPasswordSubmit} color="primary">
            Send
          </Button>
        </DialogActions>
        {message && <Typography color="primary" sx={{ m: 2 }}>{message}</Typography>}
      </Dialog>
    </Container>
  );
}