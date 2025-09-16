import React from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./FiltersPb.css";

interface FiltersPbProps {
  completionFilter: number | null; 
  sortFilter: string | null;       
  onCompletionFilter: (val: number | null) => void;
  onSortFilter: (val: string | null) => void;
  onNavigate: (page: string) => void;
}

const FiltersPb: React.FC<FiltersPbProps> = ({
  completionFilter,
  sortFilter,
  onCompletionFilter,
  onSortFilter,
  onNavigate,
}) => {
  return (
    <Box className="filters-toolbar">
      
      <FormControl size="small" className="filter-item">
        <InputLabel>Completion</InputLabel>
        <Select
        value={completionFilter === null ? "all": completionFilter.toString()}
        label="Completion"
        onChange={(e: SelectChangeEvent<string>) => {
            const valStr = e.target.value;            
            const valNum = valStr === "all" ? null : Number(valStr); 
            onCompletionFilter(valNum);               
        }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value={30}>Above 30%</MenuItem>
          <MenuItem value={50}>Above 50%</MenuItem>
          <MenuItem value={70}>Above 70%</MenuItem>
        </Select>
      </FormControl>

      
      <FormControl size="small" className="filter-item">
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortFilter ?? ""}
          label="Sort By"
          onChange={(e) => onSortFilter(e.target.value || null)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="quiz">Quiz Score</MenuItem>
          <MenuItem value="progress">Progress</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FiltersPb;

