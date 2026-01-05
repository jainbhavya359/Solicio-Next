"use client";
import Link from "next/link";
import { useState } from "react";
import {redirect, useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";


export default function LoginPage() {
  
  const [ user, setUser] = useState({
    email: "",
    password: ""
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onLogIn(){
    try{
        setLoading(true);
        setButtonDisabled(true);
        const response = await axios.post("/api/login", user);
        console.log("Login success", response.data);
    }catch(error: any){
        console.log("Login failed", error.message);
        toast.error(error.message);
        setButtonDisabled(false);
    }finally{
        setLoading(false);
        setButtonDisabled(false);
        redirect("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_#2b0f4a,_#060918_70%)] px-4">
      
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(255,0,200,0.15)] p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Join Solicio and start growing smarter
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Email
            </label>
            <input
              onChange={(e)=> {setUser({...user ,email: e.target.value})}}
              type="email"
              value={user.email}
              placeholder="you@example.com"
              className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Password
            </label>
            <input
              onChange={(e)=>{setUser({...user, password: e.target.value})}}
              type="password"
              value={user.password}
              placeholder="••••••••"
              className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          {/* Button */}
          {loading ? 
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div> : 
            <button
                disabled={buttonDisabled}
                onClick={()=> {onLogIn()}}
                type="submit"
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 font-semibold text-white shadow-lg hover:opacity-90 transition"
            >
                Log In
            </button>
          }
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-pink-400 hover:underline cursor-pointer">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
