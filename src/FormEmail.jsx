import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./FormEmail.css";
import { useSearchParams } from "react-router-dom";

const FormEmail = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const location = searchParams.get("location");

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(form.current);

    // Membuat objek data yang akan dikirim
    const data = {
      ...Object.fromEntries(formData.entries()), // Convert FormData ke objek
      lokasi: location, // Menambahkan lokasi yang didapat dari URL query
    };

    // Log data untuk debugging
    console.log("Form Data to Send:", data);

    emailjs
      .send("service_m2lm0v3", "template_1tliqwe", data, "oMQjkDEHX6CXv60Hq")
      .then(() => {
        alert("Success! Check your email");
        form.current.reset();
        setIsLoading(false);
        // window.location.href = "https://hiroshihibachi.com";
      })
      .catch((err) => {
        alert("Failed. Try Again.");
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <img
        alt="logo"
        src="/Hiroshi Hibachi.png"
        className="w-[200px]"
        onClick={() => (window.location.href = "https://hiroshihibachi.com")}
      />
      <h2 className="font-bold text-3xl text-center">Booking Form</h2>
      <form
        ref={form}
        onSubmit={sendEmail}
        className="rounded-lg shadow-xl shadow-black/10 p-10"
      >
        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-2">
            <label htmlFor="nama" className="font-bold">
              Name
            </label>
            <input
              type="text"
              name="nama"
              required
              placeholder="Andreas Inerta"
              className="border-1 border-black/80 p-2 mb-5"
            />

            <label htmlFor="user_email" className="font-bold">
              Email
            </label>
            <input
              type="email"
              name="user_email"
              required
              placeholder="andreas@gmail.com"
              className="border-1 border-black/80 p-2 mb-5"
            />

            <label htmlFor="tanggal" className="font-bold">
              Booking Date
            </label>
            <input
              type="date"
              name="tanggal"
              required
              className="border-1 border-black/80 p-2 mb-5"
            />

            <label htmlFor="lokasi" className="font-bold">
              Location
            </label>
            <input
              type="text"
              name="lokasi"
              disabled
              value={location?.toLocaleUpperCase()}
              className="border-1 border-black/80 p-2 mb-5 bg-black/10"
            />
          </section>

          <fieldset className="">
            <legend className="font-bold mb-2">Booking Time</legend>
            <div className="grid grid-cols-4 gap-4">
              {[
                "12:00 PM",
                "1:00 PM",
                "2:00 PM",
                "3:00 PM",
                "4:00 PM",
                "5:00 PM",
                "6:00 PM",
                "7:00 PM",
                "8:00 PM",
                "9:00 PM",
                "10:00 PM",
              ].map((time, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-2 border-1 border-black p-2"
                >
                  <input type="radio" name="jam" value={time} required />
                  <span>{time}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <button type="submit" disabled={isLoading} className="mt-5">
          {isLoading ? "Loading..." : "Submit Now"}
        </button>
      </form>
    </div>
  );
};

export default FormEmail;
