import { useEffect, useState } from 'react';

const WebSocketComponent = () => {
  const [message, setMessage] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Vytvoříme instanci WebSocketu
    const socket = new WebSocket('ws://localhost:3000');

    // Funkce pro připojení k WebSocketu
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
    };

    // Funkce pro přijímání zpráv
    socket.onmessage = (event) => {
      setMessage(event.data); // Nastaví přijatou zprávu do stavu
    };

    // Funkce pro uzavření spojení
    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
    };

    // Funkce pro chyby
    socket.onerror = (error) => {
      console.log('WebSocket Error: ', error);
    };

    // Cleanup při zničení komponenty (ukončení WebSocketu)
    return () => {
      socket.close();
    };
  }, []); // Effect se spustí pouze při mountnutí komponenty

  return (
    <div>
      <h1>WebSocket Connection</h1>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
      <p>Received Message: {message}</p>
    </div>
  );
};

export default WebSocketComponent;
