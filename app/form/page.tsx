"use client";
import React, { useState, useEffect, useContext } from "react";
import rifasImage from "../../public/rifas.jpg";
import Image from "next/image";
import { RifasContext } from "@/context/RifasContext";
import axios from "axios";
import { Ticket } from "@/types/TicketGenerates";
import Link from "next/link";

export default function FormPage() {
  const [timeLeft, setTimeLeft] = useState(120 * 24 * 3600);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { rifasAvailable, setRifasAvailable } = useContext(RifasContext);
  const [ticketGerenate, setTicketGerenate] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/tickets-restantes`
        );
        setRifasAvailable(response.data.ticketsDisponiveis);
        console.log("Tickets disponíveis:", response.data.ticketsDisponiveis);
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

    if (rifasAvailable >= quantity) {
      try {
        const response = await axios.post(
          `http://localhost:5000/generate-tickets`,
          { name, email, quantity }
        );
        
        const responsedata = response.data;
        console.log("Resposta da API:", responsedata);

        // Verifica se responsedata contém a propriedade tickets e se é um array
        if (responsedata && Array.isArray(responsedata.tickets)) {
          // Extraia os números dos tickets
          const ticketNumbers = responsedata.tickets.map((ticket: { ticket: number }) => ticket.ticket);
          
          // Salve os números dos tickets no localStorage
          localStorage.setItem("UserTicket", JSON.stringify(ticketNumbers));
          console.log("Tickets salvos no localStorage:", ticketNumbers);

          // Atualize o estado com os tickets gerados
          setTicketGerenate(responsedata.tickets);
        } else {
          console.error("A resposta da API não contém um array de tickets ou tickets está faltando.");
        }
        
        // Continue com o checkout
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
          window.location.href = data.url
          
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
        <p className="text-xl text-gray-600 mb-6">Preço: R$1</p>
        <h2 className="text-2xl text-gray-700 mb-2 pb-3">
          {rifasAvailable} tickets restantes
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Tempo restante: {formatTime(timeLeft)}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Seu Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-md text-gray-800"
            required
          />
          <input
            type="email"
            placeholder="Seu Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-md text-gray-800"
            required
          />
          <input
            type="number"
            min="1"
            max={rifasAvailable}
            placeholder="Quantidade de Tickets"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-md text-gray-800"
            required
          />
          <button
            type="submit"
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Comprar Rifa
          </button>
          <Link href="/consultticket">
            <p className="text-blue-500 underline">Consultar Ticket</p>
          </Link>
        </form>
      </div>
    </div>
  );
}
