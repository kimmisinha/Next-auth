"use client";
import Link from "next/link";
import React, { FormEvent, useRef, useState } from "react";

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const registerHandler = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Form cannot be empty");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email invalid");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        if (formRef.current) {
          formRef.current.reset();
          setName("");
          setEmail("");
          setPassword("");
        }
        setError("Registration Success");
      } else {
        const data = await res.json();
        console.log("User registration failed.", data.message);
        setError(data.message);
      }
    } catch (error) {
      console.log("Error during registration:", error);
    }
  };

  return (
    <div className="sm:p-10 rounded-2xl">
      <div className="p-5 border-t-2 border-green-400 rounded-2xl shadow-2xl ">
        <h1 className=" text-xl font-bold mb-5 text-center">Register</h1>
        <form
          onSubmit={registerHandler}
          ref={formRef}
          className="flex flex-col gap-3"
        >
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Full Name"
            className="sm:w-[400px] border border-gray-200 px-6 py-2 bg-zinc-100/40 rounded-lg"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Email"
            className="sm:w-[400px] border border-gray-200 px-6 py-2 bg-zinc-100/40 rounded-lg"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="sm:w-[400px] border border-gray-200 px-6 py-2 bg-zinc-100/40 rounded-lg"
          />
          <button
            type="submit"
            className="bg-green-400 px-6 py-2 text-white font-bold hover:bg-green-500 active:scale-95 rounded-lg transition-all"
          >
            Register
          </button>
          {error ? (
            <div className={`${error === "Registration Success" ? "bg-green-500" : "bg-red-500"} px-3 py-1 w-fit text-white text-sm rounded-md`}>
              {error}
            </div>
          ) : null}
          <Link href={"/"} className="text-sm text-right">
            {`Already have an account?`}{" "}
            <span className="underline"> Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
};
