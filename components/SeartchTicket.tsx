"use client";
import { useState } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation'; 

export default function SearchTicket() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [email, setEmail] = useState(""); 
  const [ticketInfo, setTicketInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 

  const handleSearch = async () => {
    if (!ticketNumber && !email) {
      alert("Por favor, insira o número do ticket ou o email.");
      return;
    }

    try {
      let response;
      if (ticketNumber) {
        response = await axios.get(`${process.env.NEXT_PUBLIC_API}/ticket-info/${ticketNumber}`);
        setTicketInfo(response.data);
      } else if (email) {
        response = await axios.get(`${process.env.NEXT_PUBLIC_API}/tickets-by-email/${email}`);
        setTicketInfo(response.data.tickets);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching ticket info", error);
      setError("Não foi possível encontrar o ticket. Verifique os dados e tente novamente.");
      setTicketInfo(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Sistema de Tickets</h1>
        <div className="mb-4">
          <label className="font-bold" htmlFor="Ticket">Consultar Ticket Único</label>
          <input
            type="text"
            id="Ticket"
            placeholder="Digite o número do ticket"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            className="px-4 py-2 border rounded-md text-gray-800 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="font-bold" htmlFor="email">Consultar todos tickets</label>
          <input
            type="email"
            id="email"
            placeholder="Digite o email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <div className="mt-4 p-4 bg-white text-gray-800 rounded-md shadow-md max-h-80 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Informações dos Tickets</h2>
            {Array.isArray(ticketInfo) ? (
              ticketInfo.length > 0 ? (
                ticketInfo.map((ticket, index) => (
                  <div key={index} className="mb-4">
                    <p><strong>Número do Ticket:</strong> #{ticket.ticket}</p>
                    <p><strong>Quantidade:</strong> {ticket.quantity}</p>
                  </div>
                ))
              ) : (
                <p>Nenhum ticket encontrado para este email.</p>
              )
            ) : (
              <div>
                <p><strong>Nome:</strong> {ticketInfo.name}</p>
                <p><strong>Email:</strong> {ticketInfo.email}</p>
                <p><strong>Número do Ticket:</strong> #{ticketInfo.ticket}</p>
                <p><strong>Quantidade:</strong> {ticketInfo.quantity}</p>
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-200 text-red-800 rounded-md shadow-md">
            <p>{error}</p>
          </div>
        )}
        <div className="mt-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
