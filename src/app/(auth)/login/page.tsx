"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/lib/api";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authAPI.login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Falha no login. Verifique suas credenciais."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background video with overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/auth/background.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </video>
      </div>

      {/* Login card */}
      <div className="relative z-20 w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="relative">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0a1a1f] to-[#1e4a5a]"></div>

            <div className="p-8 md:p-10">
              {/* Logo and tagline */}
              <div className="flex justify-center items-center mb-10">
                <img
                  src="/logos/w1-tagline.png"
                  alt="Logo"
                  className="w-70 h-18 object-contain"
                />
              </div>

              <h1 className="text-2xl font-bold text-[#0a1a1f] mb-2">
                Acesse sua conta
              </h1>
              <p className="text-gray-600 mb-8">
                Entre com suas credenciais para continuar
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {error && (
                  <div className="text-red-700 text-md mt-2 text-center font-medium">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="cursor-pointer w-full bg-gradient-to-r from-[#0a1a1f] to-[#152c35] hover:from-[#152c35] hover:to-[#1e4a5a] text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      <>
                        <span>Entrar</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-sm text-center">
                <p className="text-gray-700">Ainda não tem conta? </p>
                <Link
                  href="/register"
                  className="text-[#0a1a1f] font-semibold hover:underline transition-all"
                >
                  Crie sua conta aqui
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
