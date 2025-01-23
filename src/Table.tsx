import React, { useEffect, useState } from 'react';
import sortIcon from "./assets/sort-icon.svg";


interface Column<T> {
  header: string; // Název sloupce (např. "Jméno")
  accessor: keyof T; // Klíč do objektu typu T, který určuje, co se zobrazí v daném sloupci
}

interface TableProps<T> {
  data: T[]; // Data pro tabulku (pole objektů)
  columns: Column<T>[]; // Sloupce pro tabulku
}

function Table<T>({ data, columns }: TableProps<T>) {

  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null, direction: "asc" | "desc" }>({ key: null, direction: 'asc' });
  const [search, setSearch] = useState<{ key: keyof T | null, keyword: string }>({ key: null, keyword: '' });


  const filteredData = React.useMemo(() => {
    if (!search.key || !search.keyword) return data;

    const sorted = [...data].filter((value) => {

      const row = value[search.key as keyof T]

      if (typeof row === "string") {
        return String(row)
          .toLowerCase()
          .includes(search.keyword.toLowerCase());
      }
      return true
    });
    return sorted
  }, [sortConfig, data]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig?.key as keyof T];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);



  const handleSort = (accessor: keyof T) => {
    setSortConfig((prev) => {
      if (prev.key === accessor) {
        return { key: accessor, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key: accessor, direction: 'asc' };
    });
  };

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.header} onClick={() => handleSort(column.accessor)}>
              <input type="text"
                style={{ marginLeft: '5px' }}
                placeholder='filter'
                onChange={(e) => setSearch({ key: column.accessor, keyword: e.target.value })} />
            </th>
          ))}
        </tr>
        <tr>
          {columns.map((column) => (
            <th key={column.header} onClick={() => handleSort(column.accessor)}>
              {column.header}
              <img src={sortIcon} width={20} />

            </th>
          ))}
        </tr>

      </thead>
      <tbody>
        {sortedData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={column.header}>{String(row[column.accessor])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
