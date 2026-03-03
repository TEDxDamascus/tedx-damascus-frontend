import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";

export function filterIcon({ items, filters, onFiltered }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [value, setValue] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const lastSentDataRef = useRef(null);

  const open = Boolean(anchorEl);

  const handleFilterButtonClick = (event) => {
    if (inputVisible) {
      setInputVisible(false);
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleSelectFilter = (filter) => {
    setActiveFilter(filter);
    setValue("");
    setInputVisible(true);
    handleCloseMenu();
  };

  useEffect(() => {
    let result = items;

    if (activeFilter && value) {
      result = items.filter((item) => {
        const itemValue = item[activeFilter.key];

        if (activeFilter.type === "text") {
          return String(itemValue || "")
            .toLowerCase()
            .includes(value.toLowerCase());
        }

        if (activeFilter.type === "date") {
          if (!itemValue) return false;
        
          const itemYear = new Date(itemValue).getFullYear().toString();
          return itemYear === value;
        }

        return true;
      });
    }

    const resultString = JSON.stringify(result);
    if (lastSentDataRef.current !== resultString) {
      lastSentDataRef.current = resultString;
      onFiltered(result);
    }
  }, [value, activeFilter, items, onFiltered]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton onClick={handleFilterButtonClick}>
        <TuneIcon fontSize="large" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        {filters.map((filter) => (
          <MenuItem key={filter.key} onClick={() => handleSelectFilter(filter)}>
            {filter.label}
          </MenuItem>
        ))}
      </Menu>

      {inputVisible && activeFilter && (
        <TextField
          select={activeFilter.type === "date"}
          label={activeFilter.label}
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="small"
          InputProps={{
            endAdornment: value && (
              <InputAdornment
                position="end"
                sx={{ marginRight: activeFilter.type === "date" ? 3 : 0 }}
              >
                <IconButton size="small" onClick={() => setValue("")}>
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        >
          {activeFilter.type === "date"
            ? activeFilter.options?.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))
            : null}
        </TextField>
      )}
    </Box>
  );
}
