'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ConfirmationPayment() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<{ ticket: number; name: string; email: string }[]>([]);

  useEffect(() => {
    const reduceTickets = async () => {
      try {
        const userEmail = localStorage.getItem('UserEmail');
        const userName = localStorage.getItem('UserName');
        const quantityItem = localStorage.getItem('QuantityItem');
        const quantity = quantityItem ? parseInt(quantityItem, 10) : 0;

        if (userEmail && userName && quantity > 0) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/reduce-ticket`,
            {
              name: userName,
              email: userEmail,
              quantity: quantity,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          setTickets(response.data.tickets);
          console.log('Tickets reduced successfully');
        } else {
          setError('Ticket or user information not found, or quantity is invalid.');
        }
      } catch (error) {
        console.error('Error reducing tickets', error);
        setError('There was a problem confirming your payment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    reduceTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#333]">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Generating your tickets, please wait...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#333]">
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
    <div className="min-h-screen flex items-center justify-center bg-[#333]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Confirmed</h1>
        <p className="text-gray-600 mb-4">
          Your payment has been confirmed successfully. All tickets have been sent to your email.
        </p>
        {tickets.length > 0 && (
          <div className="text-center text-gray-600 mb-4">
            <h1 className="font-bold text-2xl">Your Tickets</h1>
            <div className="max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-inner">
              {tickets.map((ticket, index) => (
                <div key={index} className="mb-2 border-b border-gray-300 pb-2">
                  <p>#{ticket.ticket} - {ticket.name}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              To check your tickets, enter your email{' '}
              <Link className="text-blue-500 underline" href="/consultticket">
                here
              </Link>
              .
            </p>
          </div>
        )}
        <div className="flex justify-center items-center mt-4">
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
