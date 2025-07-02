import type {NextConfig} from 'next';
import { initializeApp } from "firebase/app";

const nextConfig: NextConfig = {
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  devIndicators: false,
};

const firebaseConfig = {
  apiKey: "AIzaSyDRKjQb54J4HfBbya7iwirs0TLxN25SFO8",
  authDomain: "migreen-3xrnc.firebaseapp.com",
  projectId: "migreen-3xrnc",
  storageBucket: "migreen-3xrnc.firebasestorage.app",
  messagingSenderId: "1068715304134",
  appId: "1:1068715304134:web:d66e54d5a7ed53fd3a23c7"
};

const app = initializeApp(firebaseConfig);

export default nextConfig;
