import Link from "next/link";
import React from "react";
import { FaDiscord, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Home() {
  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">
          VIP METHOD TICKET
        </h1>
        <p className="mb-4 text-center">We are happy to have you here.</p>
        <Link
          target="_blank"
          className="text-blue-500 underline"
          href="https://rentry.co/sevenx"
        >
          <h2 className="text-2xl font-semibold mb-2">VIP UPDATED LEAKS</h2>
        </Link>
        <p className="mb-4"></p>
        <h2 className="text-2xl font-semibold mb-2">Join Our Community</h2>
        <p className="mb-4 text-center">
          Join our social networks for discussions, updates, and support.
        </p>
        <div className="flex justify-center space-x-4 mb-4">
          <a
            href="https://discord.com/invite/your-invite-link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            <FaDiscord size={32} />
          </a>
        </div>
        <div className="flex justify-center">
          <Link href="/dashboard">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Buy VIP Ticket here
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
