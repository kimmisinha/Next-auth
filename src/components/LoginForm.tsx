"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>("");

  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const loginHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!email.trim() && !password.trim()) {
      setError("Form cannot be empty");
      return;
    } else if (!email.trim()) {
      setError("Email cannot be empty");
      return;
    } else if (!password.trim()) {
      setError("Password cannot be empty");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email invalid");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        return;
      } else if (res?.ok) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setError("An unexpected error occured");
    }
  };

  return (
    <div className="sm:p-10 rounded-2xl">
      <div className="p-5 border-t-2 border-green-400 rounded-2xl shadow-2xl ">
        <h1 className=" text-xl font-bold mb-5 text-center">Login</h1>
        <form onSubmit={loginHandler} className="flex flex-col gap-3">
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
          <button className=" bg-green-400 px-6 py-2 text-white font-bold hover:bg-green-500 active:scale-95 rounded-lg transition-all">
            Login
          </button>
          {error && (
            <div className="px-3 py-1 w-fit text-white text-sm bg-red-500 rounded-md">
              {error}
            </div>
          )}
        </form>
        <div className="text-center font-bold my-4">Or</div>
        <div>
          <button
            onClick={() => signIn("google")}
            className="w-full flex py-2 justify-center font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg space-x-2 active:scale-95 transition-all"
          >
            <Image
              src={"logo_google.svg"}
              alt="Google Logo"
              width={24}
              height={24}
              className=" bg-white rounded-md p-[2px]"
            />
            <span>Continue with Google</span>
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <Link href={"/register"} className="text-sm">
            {`Don't have an account?`}{" "}
            <span className="underline"> Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
