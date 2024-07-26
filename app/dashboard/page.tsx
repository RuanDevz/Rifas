"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from 'axios'

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [rifasAvailable, setRifasAvailable] = useState<number>(0)

  useEffect(() =>{
    axios.get(`${process.env.NEXT_PUBLIC_API}/tickets-restantes`)
    .then((response) =>{
      setRifasAvailable(response.data.ticketsDisponiveis)
      console.log(rifasAvailable)
    })
  },[])



  useEffect(() => {

    const savedTimeLeft = parseInt(localStorage.getItem('timeLeft') || '0', 10);
    const initialTimeLeft = savedTimeLeft > 0 ? savedTimeLeft : 120 * 24 * 3600;
    setTimeLeft(initialTimeLeft);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0;
        localStorage.setItem('timeLeft', newTime.toString());
        return newTime;
      });
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

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-[#333]">
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <h1 className="text-3xl text-white font-bold pb-10 relative z-10">
        Buy your ticket now!
      </h1>
      <div className="bg-white bg-opacity-70 p-10 rounded-lg shadow-lg text-center relative z-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Available Tickets
        </h1>
        <h2 className="text-2xl text-gray-700 mb-2">
          {rifasAvailable} tickets remaining
        </h2>
        <h3 className="text-xl text-gray-600 mb-6">
          Time left: {formatTime(timeLeft)}
        </h3>
        <Link href='/form'>
          <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300">
            Buy Ticket
          </button>
        </Link>
      </div>
    </div>
  );
}
