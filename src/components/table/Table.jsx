import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import { useTable, useSortBy, useFilters, usePagination, useResizeColumns, useFlexLayout } from 'react-table';
import { roundToTwoDecimals, formatLargeNumber } from '../../utils/Utils'; // Import the utility functions
import './Table.css';

function Table({ theme }) {
  const data = useContext(DataContext);
  const navigate = useNavigate(); // Use useNavigate hook from react-router-dom
  const [selectedRow, setSelectedRow] = useState(null); // State to store selected row details
  const [selectedColumns, setSelectedColumns] = useState(['name', 'current_price', 'market_cap', 'price_change_percentage_24h']); // State to manage selected columns
  const [searchInput, setSearchInput] = useState(''); // State to manage search input
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const allColumns = useMemo(
    () => [
      {
        Header: 'S.No',
        accessor: (row, i) => i + 1, // Use row index to generate serial number
        id: 'serialNumber',
      },
      {
        Header: 'Coin',
        accessor: 'name',
        filter: 'includes',
        Cell: ({ row }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <img
              src={row.original.image}
              alt={row.original.name}
              style={{ width: '20px', height: '20px', marginRight: '10px' }}
            />
            <div>{row.original.name}</div>
            <div style={{ color: 'gray' }}>{row.original.symbol}</div>
          </div>
        ),
      },
      { Header: 'Price', accessor: 'current_price' },
      {
        Header: 'Market Cap',
        accessor: 'market_cap',
        Cell: ({ value }) => formatLargeNumber(value), // Use the formatLargeNumber function
      },
      {
        Header: 'Volatility',
        accessor: 'volatility',
        Cell: ({ row }) => (
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between' }}>
            <div style={{ color: 'red' }}>{roundToTwoDecimals(row.original.low_24h)}</div>
            <div style={{ color: 'green' }}>{roundToTwoDecimals(row.original.high_24h)}</div>
          </div>
        ),
      },
      {
        Header: 'Price Change 24h',
        accessor: 'price_change_percentage_24h',
        Cell: ({ value }) => (
          <div style={{ color: value < 0 ? 'red' : 'green' }}>
            {roundToTwoDecimals(value)} %
            {value < 0 ? ' 🔽' : ' 🔼'}
          </div>
        ),
      },
    ],
    []
  );

  const columns = useMemo(
    () => allColumns.filter(column => selectedColumns.includes(column.accessor || column.id)),
    [selectedColumns, allColumns]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    setFilter, // Add setFilter function
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data || [], // Ensure data is an empty array if not available
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useSortBy,
    usePagination,
    useResizeColumns,
    useFlexLayout
  );

  if (!data) {
    return <p>Loading data...</p>;
  }

  const handleRowClick = (row) => {
    setSelectedRow(row.original); // Save the complete row details in state
    navigate('/coins', { state: { row: row.original } }); // Navigate to /coins page and pass the selected row data as state
  };

  const handleColumnChange = (e) => {
    const { value, checked } = e.target;
    setSelectedColumns(prev =>
      checked ? [...prev, value] : prev.filter(col => col !== value)
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value || undefined;
    setSearchInput(value);
    setFilter('name', value); // Set filter for the "Coin" column
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={`table-container ${theme}`}>
      <div className={`column-selector ${dropdownOpen ? 'show' : ''}`}>
      <button onClick={toggleDropdown}>Column Selector</button>
      {dropdownOpen && (
      <div className="column-selector-content">
        <label>
          <input
            type="checkbox"
            value="name"
            checked={selectedColumns.includes('name')}
            onChange={handleColumnChange}
          />
          Coin
        </label>
        <label>
          <input
            type="checkbox"
            value="current_price"
            checked={selectedColumns.includes('current_price')}
            onChange={handleColumnChange}
          />
          Price
        </label>
        <label>
          <input
            type="checkbox"
            value="market_cap"
            checked={selectedColumns.includes('market_cap')}
            onChange={handleColumnChange}
          />
          Market Cap
        </label>
        <label>
          <input
            type="checkbox"
            value="volatility"
            checked={selectedColumns.includes('volatility')}
            onChange={handleColumnChange}
          />
          Volatility
        </label>
        <label>
          <input
            type="checkbox"
            value="price_change_percentage_24h"
            checked={selectedColumns.includes('price_change_percentage_24h')}
            onChange={handleColumnChange}
          />
          Price Change 24h
        </label>
      </div>
  )}
  </div>
      <input
        value={searchInput}
        onChange={handleSearchChange}
        placeholder="Search Coin"
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <table {...getTableProps()} className="styled-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Table;