import * as React from 'react';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { IconButton, Stack } from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 250 },
  { field: 'price', headerName: 'Price ($)', width: 100 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'description', headerName: 'Description', width: 300 },
  { field: 'returnPolicy', headerName: 'Return Policy', width: 150, },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <div>
        <Stack spacing={2} direction="row">
          <IconButton color="primary"><Add /></IconButton>
          <IconButton color="primary"><Edit /></IconButton>
          <IconButton color="primary"><Delete /></IconButton>
        </Stack>
      </div>
    ),
  }
];

const paginationModel = { page: 0, pageSize: 10 };

export default function OrdersList() {
  const [rows, setRows] = useState([]); // Define state for rows
  const [filterRecords, setFilterRecords] = useState([]);

  const handleFilter = (event) => {
    const searchItem = event.target.value.toLowerCase();
    if (!searchItem) {
      setRows(filterRecords); // Reset filter if empty
      return;
    }

    const newData = filterRecords.filter((row) => {
      const lowerCaseRow = {
        id: row.id,
        title: row.title.toLowerCase(),
        price: row.price.toString().toLowerCase(), // Handle numeric fields
        category: row.category.toLowerCase(),
        description: row.description.toLowerCase(),
        returnPolicy: row.returnPolicy.toLowerCase(),
      };
      return Object.values(lowerCaseRow).some((value) =>
        value.toString().toLowerCase().includes(searchItem)
      );
    });
    setRows(newData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      setRows(data.products);
      setFilterRecords(data.products);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "right" }}>
        <input
          type="text"
          placeholder="Search..."
          onChange={handleFilter}
          style={{ padding: "6px 10px" }}
        />
      </div>
      <Paper sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 100]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}