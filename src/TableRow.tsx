import React from "react";
import { formatCreationDate, formatLastUpdate, formatPrice } from "./utils";

type CellProps<T> = {
    header: string;
    value: T
    cellClass?: string
};

const TableCell = <T,>({ value, header, cellClass }: CellProps<T>) => {
    return (
        <td key={header} className={"px-6 py-4 " + (cellClass ?? "")}>{String(value)}</td>
    );
};

export default React.memo(TableCell,
    (prevProps, nextProps) => prevProps.value === nextProps.value
) as typeof TableCell;

interface Row {
    item: {
        id: string;
        name: string;
        type: string;
        cuisineCountry: string;
        price: number;
        currency: string;
        createdAt: Date;
        lastUpdate: Date;
    }
}

export const TableRow = ({ item }: Row) => {

    const cells: { header: string, value: string | number, cellClass?: string }[] =
        [
            { header: "ID", value: item.id, },
            { header: "Name", value: item.name, cellClass: "font-medium text-gray-900 whitespace-nowrap dark:text-white" },
            { header: "Type", value: item.type },
            { header: "Cuisine", value: item.cuisineCountry },
            { header: "Price", value: formatPrice(Number(item.price), item.currency), cellClass: "font-medium text-gray-900 whitespace-nowrap dark:text-white" },
            { header: "Creation Date", value: formatCreationDate(item.createdAt) },
            { header: "Last update", value: formatLastUpdate(item.lastUpdate) }
        ]

    return (
        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            {cells.map(cell => <TableCell {...cell} />)}
        </tr >
    )
}

export const TableRowMemo = React.memo(TableRow,
    (prevProps, nextProps) => prevProps.item.price === nextProps.item.price
) as typeof TableRow;
