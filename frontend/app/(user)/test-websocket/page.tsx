'use client';
// Frontend implementation with Next.js
import { Client } from '@stomp/stompjs';
import { useState, useEffect } from 'react';

export default function ConnectionPage() {
  const [stompClient, setStompClient] = useState<Client | undefined>(undefined);

  // Environment variables
  const stompClientUrl = process.env.NEXT_PUBLIC_URL_STORM_CLIENT;

  console.log(stompClientUrl);

  // Establishing connection
  useEffect(() => {
    console.log('Creating STOMP client...');
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080' + '/ou-document-hub',
    });
    console.log('Activating STOMP connection...');
    stompClient.activate();
    stompClient.onConnect = function () {
      console.log('Successfully connected to STOMP client.');
      setStompClient(stompClient);
    };
  }, [stompClient]);
}
