import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import "./Table.css";

export default function Table({ rows, executeOnRowClick }) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const keysTable = Object.keys(rows[0]);
    keysTable.shift();
    setColumns(
      keysTable.map((item) => {
        const column = {
          field: item,
          headerName: item.toUpperCase(),
          flex: 1,
        };
        return column;
      })
    );
  }, []);

  return (
    <div className="table-body">
      <DataGrid
        rows={rows}
        columns={columns}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: { printOptions: { disableToolbarButton: true } },
        }}
        onRowClick={(e) => executeOnRowClick(e)}
      />
    </div>
  );
}
