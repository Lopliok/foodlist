import { useEffect, useMemo, useState } from 'react';
import './index.css';

import { useReducer } from 'react';
import { TableRowMemo } from './TableRow';

interface FoodItem {
    id: string;
    name: string;
    type: string;
    description: string;
    cuisineCountry: string;
    price: { value: number; currency: string };
    createdAt: Date;
    lastUpdate: Date;
}

interface TableState {
    data: FoodItem[];
    lastFetched: Record<string, number>;
}

type Action =
    | { type: 'UPDATE_ITEM'; payload: FoodItem }
    | { type: 'ADD_ITEM'; payload: FoodItem };

const initialState: TableState = {
    data: [],
    lastFetched: {},
};

function tableReducer(state: TableState, action: Action): TableState {
    switch (action.type) {
        case 'UPDATE_ITEM': {
            const updatedData = state.data.map(item =>
                item.id === action.payload.id ? { ...item, ...action.payload } : item
            );
            return { ...state, data: updatedData };
        }
        case 'ADD_ITEM': {
            return { ...state, data: [...state.data, action.payload] };
        }
        default:
            return state;
    }
}

export const TableApp = () => {
    const [state, dispatch] = useReducer(tableReducer, initialState);
    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState<keyof FoodItem | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000'); // Example WebSocket URL

        ws.onmessage = async event => {
            const items: [string, number, string][] = JSON.parse(event.data);

            items.forEach(async (item) => {
                const [id, price, currency] = item
                const now = Date.now();

                if (!state.lastFetched[id] || now - state.lastFetched[id] > 5000) {

                    const response = await fetch(`api/items?id=${id}`);
                    const data = (await response.json())?.[0];

                    const foodItem: FoodItem = {
                        id: data.id,
                        name: data.name,
                        type: data.type,
                        description: data.description,
                        cuisineCountry: data.cuisineCountry,
                        price: { value: price, currency: currency },
                        createdAt: new Date(data.createdAt),
                        lastUpdate: new Date(),
                    };

                    if (state.data.find(item => item.id === id)) {
                        dispatch({ type: 'UPDATE_ITEM', payload: foodItem });
                    } else {
                        dispatch({ type: 'ADD_ITEM', payload: foodItem });
                    }
                }


            });


        };

        return () => ws.close();
    }, [state.lastFetched, state.data]);

    const filteredData = useMemo(() => {
        return state.data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [state.data, filter]);

    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return -1;
            if (a[sortKey] > b[sortKey]) return 1;
            return 0;
        });
    }, [filteredData, sortKey]);


    return (
        <div className="container mx-auto p-6">
            <div className="flex relative gap-4 mb-4">
                <div className='flex-1'>
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        className='block p-4 w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        placeholder="Filter table..."
                        value={filter}
                        onChange={(e: any) => setFilter(e.target.value)}
                    />
                </div>
                <select className='flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={(e: any) => setSortKey(e.target.value as keyof FoodItem)}>
                    <option value="">Sort by</option>
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="type">Type</option>
                    <option value="price">Price</option>
                    <option value="creationDate">Creation Date</option>
                    <option value="lastUpdate">Last Update</option>
                </select>
            </div>

            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                        <th className='px-6 py-3'>ID</th>
                        <th className='px-6 py-3'>Name</th>
                        <th className='px-6 py-3'>Type</th>
                        <th className='px-6 py-3'>Cuisine</th>
                        <th className='px-6 py-3'>Price</th>
                        <th className='px-6 py-3'>Creation Date</th>
                        <th className='px-6 py-3'>Last Update</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item) => (
                        <TableRowMemo key={item.id} item={{ ...item, price: item.price.value, currency: item.price.currency }} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
