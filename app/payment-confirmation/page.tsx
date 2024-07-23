'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ConfirmationPayment() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketsGenerate, setTicketsGenerate] = useState<string | null>(null);

  useEffect(() => {
    const reduceTickets = async () => {
      const ticketString = localStorage.getItem("UserTicket");

      if (ticketString) {
        setTicketsGenerate(ticketString);

        const ticketData = JSON.parse(ticketString);

        try {
          if (Array.isArray(ticketData) && ticketData.length > 0) {
            // Calcular a quantidade total
            const quantities = ticketData.map((ticket: any) => ticket.quantity);

            await axios.post(
              `${process.env.NEXT_PUBLIC_API}/reduce-ticket`,
              {
                quantity: quantities.reduce((acc, quantity) => acc + quantity, 0),
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("Tickets reduced successfully");
            setTickets(ticketData);
          } else {
            setError("Nenhum ticket encontrado.");
          }
        } catch (error) {
          console.error("Error reducing tickets", error);
          setError(
            "Houve um problema ao confirmar seu pagamento. Tente novamente mais tarde."
          );
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Loading...</h1>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center items-center">
            <Link href="/">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Back to Home
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Confirmed</h1>
        <p className="text-gray-600 mb-4">
          Your payment has been confirmed successfully. All tickets have been sent to your email.
        </p>
        {ticketsGenerate && (
          <div className="text-center text-gray-600 mb-4">
            <h1 className="font-bold text-2xl">Your Tickets</h1>
            {tickets.map((ticket, index) => (
              <div key={index} className="mb-2">
                <p>#{ticket}</p>
              </div>
            ))}
            <p>
              To check your tickets, enter your email{" "}
              <Link className="text-blue-500 underline" href="/consultticket">
                here
              </Link>
              .
            </p>
          </div>
        )}
        <div className="flex justify-center items-center">
          <Link href="/">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}  