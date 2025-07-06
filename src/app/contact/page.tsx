"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xvgrnwww", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">Contact Us</h1>
      <p className="mb-6 text-gray-600 text-center">
        We'd love to hear from you! Fill out the form below or email us directly at{" "}
        <a href="mailto:support@cleanmodo.com" className="text-blue-600 underline">support@cleanmodo.com</a>
      </p>

      <div className="bg-white shadow rounded-lg p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        {/* Success/Error message */}
        {status === "success" && (
          <div className="mt-4 text-green-600 text-center font-semibold">
            Your message has been sent! Thank you for contacting us.
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 text-red-600 text-center font-semibold">
            Sorry, something went wrong. Please try again later.
          </div>
        )}
      </div>

      <div className="mt-8 text-gray-500 text-center text-sm">
        For Partnerships & Media:{" "}
        <a href="mailto:hello@cleanmodo.com" className="text-blue-600 underline">
          hello@cleanmodo.com
        </a>
        <br />
        We strive to respond within 24-48 business hours.
      </div>
    </div>
  );
}
