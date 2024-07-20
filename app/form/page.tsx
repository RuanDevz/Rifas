'use client'
import React, { useState, useEffect, useContext } from "react";
import rifasImage from "../../public/rifas.jpg";
import Image from "next/image";
import { RifasContext } from "@/context/RifasContext";
import axios from 'axios';
import { ruffleTypes } from "@/types/Rufletypes";
import { Ticket } from "@/types/TicketGenerates";

export default function FormPage() {
  const [timeLeft, setTimeLeft] = useState(120 * 24 * 3600);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { rifasAvailable, setRifasAvailable } = useContext(RifasContext);

  const [ticketGerenate, setTicketGerenate] = useState<Ticket[]>([])




  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/tickets-restantes`);
        setRifasAvailable(response.data.ticketsDisponiveis);
        console.log(response.data.ticketsDisponiveis);
      } catch (error) {
        console.error("Error fetching tickets", error);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rifasAvailable > 0) {

      try{
        await axios.post(`${process.env.NEXT_PUBLIC_API}/generate-ticket`, {name, email})
        .then((response) =>{
          console.log(response.data.ticket)
          setTicketGerenate(response.data.ticket)

          localStorage.setItem('UserTicket', JSON.stringify(response.data.ticket));
        })
      } catch(error){
        console.log(error)
      }

      const products = [{
        name: "VIP Method Ticket",
        price: 1,
        quantity: 1,
      }];

      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/create-checkout`, { products });
        window.location.href = data.url;
      } catch (error) {
        console.error("Error creating checkout session", error);
      }
    } else {
      alert("All tickets have been sold!");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <Image
        src={rifasImage}
        alt="Rifas Background"
        layout="fill"
        objectFit="cover"
        className="absolute z-0"
      />
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div className="bg-white bg-opacity-70 p-10 rounded-lg shadow-lg text-center relative z-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          VIP METHOD TICKET
        </h1>
        <p className="text-xl text-gray-600 mb-6">Price: $1</p>
        <h2 className="text-2xl text-gray-700 mb-2 pb-3">
          {rifasAvailable} tickets remaining
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Time left: {formatTime(timeLeft)}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-md text-gray-800"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-md text-gray-800"
            required
          />
          <button
            type="submit"
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Buy Raffle
          </button>
        </form>
      </div>
    </div>
  );
}
