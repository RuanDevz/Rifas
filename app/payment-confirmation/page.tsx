"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function ConfirmationPayment() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ticket, setTicket] = useState<any>(null); 

  useEffect(() => {
    const reduceTickets = async () => {
      const ticketString = localStorage.getItem('UserTicket');
      
      if (ticketString) {
        const ticketData = JSON.parse(ticketString);

        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API}/reduce-ticket`, {
            quantity: ticketData.quantity // Envia a quantidade do ticket
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log("Tickets reduced successfully");
          setTicket(ticketData); 
        } catch (error) {
          console.error("Error reducing tickets", error);
          setError("Houve um problema ao confirmar seu pagamento. Tente novamente mais tarde.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Ticket não encontrado.");
        setLoading(false);
      }
    };

    reduceTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Carregando...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-600 mb-6">
            Erro
          </h1>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <div className="flex justify-center items-center">
            <Link href="/">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Voltar para o início
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Pagamento Confirmado
        </h1>
        <p className="text-gray-600 mb-4">
          O seu pagamento foi confirmado com sucesso. Obrigado por utilizar nosso serviço!
        </p>
        {ticket && (
          <div className="text-center text-gray-600 mb-4">
            <p>Seu Ticket é: #{ticket.ticket}</p>
            <p>Quantidade comprada: {ticket.quantity}</p>
          </div>
        )}
        <div className="flex justify-center items-center">
          <Link href="/">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Voltar para o início
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
