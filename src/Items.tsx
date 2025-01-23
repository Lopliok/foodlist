import { useCallback, useEffect, useState } from 'react';
import Table from './Table';


type ItemType = 'food' | 'drink';

interface BeverageBase {
  id: string;
  price: number
}

interface Beverage extends BeverageBase {
  id: string; // Id položky
  name: string; // Název položky
  description: string; // Popis položky
  type: ItemType; // Typ položky (food nebo drink)
  cuisineCountry: string; // Třípísmenný kód země kuchyně (ISO 3166-1 alpha-3)
  createdAt: string; // Datum vytvoření položky (ISO 8601)
  isVegetarian?: boolean; // Volitelné, zda je položka vegetariánská (default: false)
  isVegan?: boolean; // Volitelné, zda je položka veganská (default: false)
  isAlcoholic?: boolean; // Volitelné, zda je položka alkoholická (default: false)
}


const loadQueue: BeverageBase[] = [];


const columns: { header: string, accessor: keyof Beverage }[] = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "description", accessor: "description" },
  { header: "type", accessor: "type" },
  { header: "cuisine country", accessor: "cuisineCountry" },
  { header: "created at", accessor: "createdAt" },
  { header: "vegetarian", accessor: "isVegetarian" },
  { header: "vegan", accessor: "isVegan" },
  { header: "alcohol", accessor: "isAlcoholic" },
]

const Items = () => {
  const [items, setItems] = useState<Beverage[]>([]);


  const updateItems = (newItems: [string, number][]) => {

    newItems.filter(item => {
      const [id, price] = item
      const listedItem = items.find(i => i.id === id)
      if (!listedItem) {
        loadQueue.push({ id, price })
      } else {
        setItems((prev) => [...prev.filter(p => p.id !== id), { ...listedItem, price }])
      }
    })

  }

  const loadItems = useCallback(async () => {

    let apiCalls = []

    while (loadQueue.length > 0) {
      const item = loadQueue.shift()
      if (item) {
        const apiCall = fetch("api/items?id=" + item.id)
        apiCalls.push(apiCall)
      }
    }
    const responses = await Promise.all(apiCalls);

    await Promise.all(responses.map(async (res) => await res.json().then(d => {
      const item = d?.[0]
      item && setItems((prev) => [...prev.filter(p => p.id !== item.id), { ...item, price: item.price }])
    })))


  }, [])

  useEffect(() => {
    const interval = window.setInterval(loadItems, 5000)
    return () => {
      window.clearInterval(interval)
    }

  }, [])

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.onmessage = (event) => {
      const items: [string, number][] = JSON.parse(event.data);
      updateItems(items)
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Item table</h1>
      <Table columns={columns} data={items} />
    </div>
  );
};

export default Items;
