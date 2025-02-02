"use client";
import React, { useState, useEffect, useContext } from "react";
import { RifasContext } from "@/context/RifasContext";
import axios from "axios";
import { Ticket } from "@/types/TicketGenerates";
import Link from "next/link";

export default function FormPage() {
  const [timeLeft, setTimeLeft] = useState(120 * 24 * 3600);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(5);
  const { rifasAvailable, setRifasAvailable } = useContext(RifasContext);
  const [ticketGerenate, setTicketGerenate] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/tickets-restantes`
        );
        setRifasAvailable(response.data.ticketsDisponiveis);
      } catch (error) {
        console.error("Error fetching tickets", error);
      }
    };

    fetchTickets();
  }, []);
  
  
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API}/time-left`).then((response) => {
      setTimeLeft(response.data.timeLeft);
    });

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

    if (rifasAvailable >= quantity) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/generate-tickets`,
          { name, email, quantity }
        );

        localStorage.setItem("UserEmail", email);
        localStorage.setItem("UserName", name);
        localStorage.setItem("QuantityItem", JSON.stringify(quantity))

        const responsedata = response.data;
        console.log("Resposta da API:", responsedata);

        if (responsedata && Array.isArray(responsedata.tickets)) {
          const ticketNumbers = responsedata.tickets.map(
            (ticket: { ticket: number }) => ticket.ticket
          );

          localStorage.setItem("UserTicket", JSON.stringify(ticketNumbers));
          console.log("Tickets salvos no localStorage:", ticketNumbers);

          setTicketGerenate(responsedata.tickets);
        } else {
          console.error(
            "A resposta da API não contém um array de tickets ou tickets está faltando."
          );
        }

        const products = [
          {
            name: "VIP Method Ticket",
            price: 1,
            quantity,
          },
        ];

        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/create-checkout`,
            { products }
          );
          window.location.href = data.url;
        } catch (error) {
          console.error("Error creating checkout session", error);
        }
      } catch (error) {
        console.error("Error generating ticket", error);
      }
    } else {
      alert("Não há tickets suficientes disponíveis!");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#333]">
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div className="bg-white bg-opacity-70 p-10 rounded-lg shadow-lg text-center relative z-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          VIP METHOD TICKET
        </h1>
        <p className="text-xl text-gray-600 mb-6">PRICE: $1</p>
        <h2 className="text-2xl text-gray-700 mb-2 pb-3">
          {rifasAvailable} REMAINING VIP TICKETS
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          TIME LEFT: {formatTime(timeLeft)}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-md text-gray-800"
            required
          />
          <input
            type="email"
            placeholder="Your e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-md text-gray-800"
            required
          />
          <input
            type="number"
            min={5}
            max={rifasAvailable} 
            placeholder="Tickets quantity"
            value={quantity}
            onChange={(e) => {
              const newValue = e.target.value.slice(0, 4); 
              setQuantity(parseInt(newValue));
            }}
            className="px-4 py-2 border rounded-md text-gray-800"
            required
          />

          <button
            type="submit"
            className="px-8 py-4 bg-black text-white text-lg font-semibold rounded-md hover:bg-[#333] transition-colors duration-300"
          >
            BUY VIP TICKET NOW
          </button>
          <Link href="/consultticket">
            <p className="text-black underline">CONSULT TICKET</p>
          </Link>
        </form>
      </div>
    </div>
  );
}
