import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./FiltersPb.css";

interface FiltersPbProps {
  onCompletionFilter: (val: number | null) => void;
  onSortFilter: (val: string | null) => void;
  onNavigate: (page: string) => void;
}

const FiltersPb: React.FC<FiltersPbProps> = ({
  onCompletionFilter,
  onSortFilter,
  onNavigate,
}) => {
  return (
    <Box className="filters-toolbar">
      
      <FormControl size="small" className="filter-item">
        <InputLabel>Completion</InputLabel>
        <Select
          defaultValue=""
          label="Completion"
          onChange={(e) =>
            onCompletionFilter(e.target.value ? Number(e.target.value) : null)
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={30}>Above 30%</MenuItem>
          <MenuItem value={50}>Above 50%</MenuItem>
          <MenuItem value={70}>Above 70%</MenuItem>
        </Select>
      </FormControl>

      
      <FormControl size="small" className="filter-item">
        <InputLabel>Sort By</InputLabel>
        <Select
          defaultValue=""
          label="Sort By"
          onChange={(e) => onSortFilter(e.target.value || null)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="progress">Progress</MenuItem>
        </Select>
      </FormControl>

      
      <FormControl size="small" className="filter-item">
        <InputLabel>Charts</InputLabel>
        <Select
          defaultValue=""
          label="Charts"
          onChange={(e) => e.target.value && onNavigate(e.target.value)}
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="line">Line Chart</MenuItem>
          <MenuItem value="bar">Bar Chart</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FiltersPb;

