import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Paper,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import axios from 'axios';
import { InputAdornment } from '@mui/material';

const columns = [
  { field: 'productId', headerName: 'Product ID', width: 100 },
  { field: 'productName', headerName: 'Product Name', width: 150 },
  { field: 'productGroup', headerName: 'Group', width: 150 },
  { field: 'productPrice', headerName: 'Price', width: 100 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Stack spacing={2} direction="row">
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            params.row.handleOpenModal(params.row);
          }}
        >
          <Edit />
        </IconButton>
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            params.row.handleOpenWarningModal(params.row);
          }}
        >
          <Delete />
        </IconButton>
      </Stack>
    ),
  },
];

export default function OrdersList() {
  const [rows, setRows] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const [warningOpen, setWarningOpen] = useState(false);

  const handleOpenModal = (row = null) => {
    setEditRow(row || { productId: '', productName: '', productGroup: '', productPrice: '' });
    setIsEditing(!!row);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditRow(null);
  };

  const handleOpenWarningModal = (row) => {
    setDeleteRow(row);
    setWarningOpen(true);
  };

  const handleCloseWarningModal = () => {
    setDeleteRow(null);
    setWarningOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8989/api/product/${deleteRow.id}`);
      setRows((prev) => prev.filter((row) => row.id !== deleteRow.id));
      setFilterRecords((prev) => prev.filter((row) => row.id !== deleteRow.id));
      handleCloseWarningModal();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        const response = await axios.put('http://localhost:8989/api/product', editRow);
        setRows((prev) =>
          prev.map((row) => (row.productId === editRow.productId ? response.data : row))
        );
      } else {
        const response = await axios.post('http://localhost:8989/api/product', editRow);
        setRows((prev) => [...prev, response.data]);
        setFilterRecords((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error saving record:', error);
    } finally {
      setOpen(false);
    }
  };

  const handleFilter = (event) => {
    const searchItem = event.target.value.toLowerCase();
    if (!searchItem) {
      setRows(filterRecords);
      return;
    }
    const filteredData = filterRecords.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchItem)
      )
    );
    setRows(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8989/api/product');
        setRows(response.data);
        setFilterRecords(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <Button onClick={() => handleOpenModal()} startIcon={<Add />}>
          Add New Record
        </Button>
        <input
          type="text"
          placeholder="Search..."
          onChange={handleFilter}
          style={{ padding: '6px 10px', float: 'right' }}
        />
      </div>
      <Paper sx={{ width: '100%', display: 'table', tableLayout: 'fixed' }}>
        <DataGrid
          rows={rows.map((row) => ({ ...row, handleOpenModal, handleOpenWarningModal }))}
          columns={columns}
          pageSizeOptions={[5, 10, 100]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
      <Dialog
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="product-dialog-title"
        aria-describedby="product-dialog-description"
      >
        <DialogTitle id="product-dialog-title">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent id="product-dialog-description">
          {['productId', 'productName', 'productGroup', 'productPrice'].map((field, index) => (
            <TextField
              key={index}
              margin="dense"
              label={field.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase())} // Capitalize the first letter
              fullWidth
              value={editRow?.[field] || ''}
              onChange={(e) => setEditRow((prev) => ({ ...prev, [field]: e.target.value }))}
              type={field === 'productPrice' ? 'number' : 'text'}
              InputProps={
                field === 'productPrice'
                  ? {
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }
                  : null
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={warningOpen}
        onClose={handleCloseWarningModal}
        aria-labelledby="warning-dialog-title"
      >
        <DialogTitle id="warning-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarningModal}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
