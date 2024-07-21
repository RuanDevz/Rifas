"use client";
import { useState } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Importa o useRouter

export default function SearchTicket() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketInfo, setTicketInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Instancia o useRouter

  const handleSearch = async () => {
    if (!ticketNumber) {
      alert("Por favor, insira o número do ticket.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/ticket-info/${ticketNumber}`);
      setTicketInfo(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching ticket info", error);
      setError("Não foi possível encontrar o ticket. Verifique o número e tente novamente.");
      setTicketInfo(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Sistema de Tickets</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Digite o número do ticket"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            className="px-4 py-2 border rounded-md text-gray-800 w-full"
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
        >
          Buscar Ticket
        </button>
        {ticketInfo && (
          <div className="mt-4 p-4 bg-white text-gray-800 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2">Informações do Ticket</h2>
            <p><strong>Nome:</strong> {ticketInfo.name}</p>
            <p><strong>Email:</strong> {ticketInfo.email}</p>
            <p><strong>Número do Ticket:</strong> #{ticketInfo.ticket}</p>
            <p><strong>Quantidade:</strong> {ticketInfo.quantity}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-200 text-red-800 rounded-md shadow-md">
            <p>{error}</p>
          </div>
        )}
        <div className="mt-4">
          <button
            onClick={() => router.back()} // Volta à página anterior
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
