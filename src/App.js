import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputBase,
  IconButton,
  // Tooltip,
  TableSortLabel,
  TablePagination,
  InputLabel,
  MenuItem,
  FormControl,
  Select

} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  table: {
    minWidth: 650,
  },
  thumbnail: {
    height:"55px",
    width:"80px"
  }
});

const App = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('brand');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allCategories, setAllCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");

  useEffect(() => {
    axios.get('https://dummyjson.com/products').then(res => {
      setData(res.data);

      let duplicateCategories = res.data?.products?.map((item)=>{ return item.category})
      let uniqueCategories = duplicateCategories?.filter((item, index) => {
       return duplicateCategories.indexOf(item) === index
       })
       setAllCategories(uniqueCategories);
    });
  }, []);






  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSort = column => {
    if (column !== sortColumn) {
      setSortColumn(column);
      setSortDirection('asc');
    } else {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(event.target.value);
  };

  const categoryData = 
   selectedCategory ?
    (data?.products?.filter(item =>
      item.category.toLowerCase().includes(selectedCategory.toLowerCase())
    )) : data?.products;
  

  const filteredData = categoryData?.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = filteredData?.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  });

  const currentItems = sortedData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <TableContainer component={Paper}>
      {/* <Tooltip title="Search"> */}
        <IconButton className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearch}
        />
    <FormControl sx={{ m: 1, minWidth: 120 }} size="large">
      <InputLabel id="demo-select-small">Filter by category</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={selectedCategory}
        label="Age"
        onChange={handleCategoryChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {allCategories?.map((item)=>{
          return <MenuItem value={item}>{item}</MenuItem>
        })}
        
      </Select>
    </FormControl>
      {/* </Tooltip> */}
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>
              <TableSortLabel
                active={sortColumn === 'title'}
                direction={sortDirection}
                onClick={() => handleSort('title')}
              >
                Title
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'brand'}
                direction={sortDirection}
                onClick={() => handleSort('brand')}
              >
                Brand
              </TableSortLabel>
            </TableCell>
            
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'price'}
                direction={sortDirection}
                onClick={() => handleSort('price')}
              >
                Price
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'rating'}
                direction={sortDirection}
                onClick={() => handleSort('rating')}
              >
                Rating
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'category'}
                direction={sortDirection}
                onClick={() => handleSort('category')}
              >
                Category
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortColumn === 'thumbnail'}
                direction={sortDirection}
                onClick={() => handleSort('thumbnail')}
              >
                Thumbnail
              </TableSortLabel>
            </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {currentItems?.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell component="th" scope="row">
                {item.brand}
              </TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.rating}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell><img src={item.thumbnail} className={classes.thumbnail}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default App;
