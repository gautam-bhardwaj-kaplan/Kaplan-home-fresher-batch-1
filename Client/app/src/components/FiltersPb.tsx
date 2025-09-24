import React from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import "./FiltersPb.css";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface FiltersPbProps {
  completionFilter: number | null;
  sortFilter: string | null;
  searchQuery: string;
  onCompletionFilter: (val: number | null) => void;
  onSortFilter: (val: string | null) => void;
  onNavigate: (page: string) => void;
  onClearFilters: () => void;
  onSearch: (val: string) => void;
}

const FiltersPb: React.FC<FiltersPbProps> = ({
  completionFilter,
  sortFilter,
  searchQuery,
  onCompletionFilter,
  onSortFilter,
  onNavigate,
  onClearFilters,
  onSearch,
}) => {
  return (
    <Box className="filters-toolbar">
      <FormControl size="small" className="filter-item">
        <InputLabel>Completion</InputLabel>
        <Select
          value={
            completionFilter === null ? "all" : completionFilter.toString()
          }
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
      <Button
        variant="outlined"
        size="small"
        className="filter-item"
        onClick={onClearFilters}
        startIcon={<RestartAltIcon fontSize="small" />}
      >
        Clear Filters
      </Button>
      <TextField
        size="small"
        className="search-bar"
        placeholder="Search by course"
        value={searchQuery}
        onChange={(e) => {
          const value = e.target.value;
          onSearch(value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  onSearch("");
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default FiltersPb;
