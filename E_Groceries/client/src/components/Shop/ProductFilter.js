import React, { useState } from 'react';
import { Select } from 'antd';
import './ProductCard.css'

const { Option } = Select;

const ProductFilter = ({ onFilterChange }) => {
  const [range, setRange] = useState(null);

  const Prices = [
    {
      _id: 0,
      name: "0/- to 49/-",
      array: [0, 49]
    },
    {
      _id: 1,
      name: "50/- to 99/-",
      array: [50, 99]
    },
    {
      _id: 2,
      name: "100/- to 149/-",
      array: [100, 149]
    },
    {
      _id: 3,
      name: "150/- to 249/-",
      array: [150, 249]
    },
    {
      _id: 4,
      name: "Above 250/- ",
      array: [250, 10000]
    }, {
      _id: 5,
      name: "All ",
      array: [0, 10000]
    },
  ];

  const handleRangeChange = (value) => {
    const selectedRange = Prices.find((p) => p.array === value);
    setRange(value);
    onFilterChange(selectedRange);
  };

  return (
    <div>
      <h4 className="filter-title">Filter By Price</h4>
      <div className="filterContainer">
        <Select
          value={range}
          onChange={handleRangeChange}
          style={{ width: 150 }}
          placeholder="Select a range"
          className="filter-select"
        >
          {Prices.map((p) => (
            <Option key={p._id} value={p.array} className="filterOption">
              {p.name}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default ProductFilter;
