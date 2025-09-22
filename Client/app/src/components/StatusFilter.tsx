import React from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./StatusFilterDialog.css";
interface StatusFilterDialogProps {
  statusFilter: string | null;
  onStatusFilterChange: (val: string | null) => void;
}

const StatusFilterDialog: React.FC<StatusFilterDialogProps> = ({
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <Box className="status-filter-dialog">
      <FormControl size="small" fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter ?? "all"}
          label="Status"
          onChange={(e: SelectChangeEvent<string>) => {
            const val = e.target.value === "all" ? null : e.target.value;
            onStatusFilterChange(val);
          }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default StatusFilterDialog;
