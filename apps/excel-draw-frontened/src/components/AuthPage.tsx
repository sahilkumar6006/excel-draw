"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BACKENED_URL } from '@/config';
import axios from 'axios';
export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("isSignin", isSignin)
    const endpoint = isSignin ? `${BACKENED_URL}/user/sign-in` : `${BACKENED_URL}/user/sign-up`;
    e.preventDefault();
    try {
      // const response = await request.post(endpoint, { email, password });
      console.log("endpoint", endpoint)
      const response = await axios.post(endpoint, { email, password });
      
      if (!response.data) {
        throw new Error(`Failed to ${isSignin ? 'authenticate' : 'register'}`);
      }
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        router.push('/');
      }
    } catch (error) {
      console.error(`Error during ${isSignin ? 'authentication' : 'registration'}:`, error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-red">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{isSignin ? "Welcome Back" : "Create Account"}</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-black"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-black"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          {isSignin ? "Don't have an account? " : "Already have an account? "} 
          <button
            onClick={() => router.push(isSignin ? '/signup' : '/signin')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isSignin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};