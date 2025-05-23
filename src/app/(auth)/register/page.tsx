"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Calendar,
  Phone,
  CreditCard,
  MapPin,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle,
  Building,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";
import { authAPI } from "@/lib/api";
import { Register } from "@/types/Register";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const totalSteps = 3;

  const [formData, setFormData] = useState<Register>({
    nome: "",
    sobrenome: "",
    email: "",
    password: "",
    password_confirm: "",
    data_nascimento: "",
    cpf: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    renda_mensal: undefined,
    tem_patrimonio: false,
    conhecimento_investimento: "beginner",
    aceita_termos: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Helper function to check if password is too similar to personal info
  const isPasswordTooSimilar = (
    password: string,
    nome: string,
    sobrenome: string,
    email: string
  ) => {
    const lowerPassword = password.toLowerCase();
    const lowerNome = nome.toLowerCase();
    const lowerSobrenome = sobrenome.toLowerCase();
    const lowerEmail = email.toLowerCase().split("@")[0];
    return (
      lowerPassword.includes(lowerNome) ||
      lowerPassword.includes(lowerSobrenome) ||
      lowerPassword.includes(lowerEmail)
    );
  };

  // Helper function to check if password is too common
  const isPasswordCommon = (password: string) => {
    const commonPasswords = [
      "password",
      "12345678",
      "qwertyui",
      "abc12345",
      "letmein",
    ];
    return commonPasswords.includes(password.toLowerCase());
  };

  const validateStep = (step: number) => {
    setError(null);

    switch (step) {
      case 1:
        if (!formData.nome) {
          setError("Por favor, preencha o nome.");
          return false;
        }
        if (!formData.sobrenome) {
          setError("Por favor, preencha o sobrenome.");
          return false;
        }
        if (!formData.email) {
          setError("Por favor, preencha o e-mail.");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError("Formato de e-mail inválido.");
          return false;
        }
        if (!formData.password) {
          setError("Por favor, preencha a senha.");
          return false;
        }
        if (formData.password.length < 8) {
          setError("A senha deve ter pelo menos 8 caracteres.");
          return false;
        }
        if (/^\d+$/.test(formData.password)) {
          setError("A senha não pode ser inteiramente numérica.");
          return false;
        }
        if (
          isPasswordTooSimilar(
            formData.password,
            formData.nome,
            formData.sobrenome,
            formData.email
          )
        ) {
          setError("A senha é muito semelhante às suas informações pessoais.");
          return false;
        }
        if (isPasswordCommon(formData.password)) {
          setError("A senha é muito comum. Escolha uma senha mais segura.");
          return false;
        }
        if (!formData.password_confirm) {
          setError("Por favor, confirme a senha.");
          return false;
        }
        if (formData.password !== formData.password_confirm) {
          setError("As senhas não coincidem.");
          return false;
        }
        if (!formData.data_nascimento) {
          setError("Por favor, preencha a data de nascimento.");
          return false;
        }
        const today = new Date();
        const birthDate = new Date(formData.data_nascimento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        if (age < 18) {
          setError("Você deve ter pelo menos 18 anos.");
          return false;
        }
        if (!formData.cpf) {
          setError("Por favor, preencha o CPF.");
          return false;
        }
        if (formData.cpf.replace(/\D/g, "").length !== 11) {
          setError("CPF inválido. Deve conter 11 dígitos.");
          return false;
        }
        if (!formData.telefone) {
          setError("Por favor, preencha o telefone.");
          return false;
        }
        if (formData.telefone.replace(/\D/g, "").length < 10) {
          setError("Telefone inválido. Deve conter pelo menos 10 dígitos.");
          return false;
        }
        return true;
      case 2:
        if (!formData.cep) {
          setError("Por favor, preencha o CEP.");
          return false;
        }
        if (!formData.rua) {
          setError("Por favor, preencha o endereço.");
          return false;
        }
        if (!formData.numero) {
          setError("Por favor, preencha o número.");
          return false;
        }
        if (!formData.bairro) {
          setError("Por favor, preencha o bairro.");
          return false;
        }
        if (!formData.cidade) {
          setError("Por favor, preencha a cidade.");
          return false;
        }
        if (!formData.estado) {
          setError("Por favor, selecione o estado.");
          return false;
        }
        return true;
      case 3:
        if (!formData.renda_mensal && formData.renda_mensal !== 0) {
          setError("Por favor, selecione sua renda mensal.");
          return false;
        }
        if (!formData.conhecimento_investimento) {
          setError(
            "Por favor, selecione seu nível de conhecimento em investimentos."
          );
          return false;
        }
        if (!formData.aceita_termos) {
          setError("Você deve aceitar os termos de uso.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        setError(null);
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
      window.scrollTo(0, 0);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  };

  const fetchAddressByCEP = async () => {
    if (formData.cep.replace(/\D/g, "").length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${formData.cep.replace(/\D/g, "")}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = formatCEP(value);

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (formattedValue.replace(/\D/g, "").length === 8) {
      fetchAddressByCEP();
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: formatCPF(value),
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: formatPhone(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== totalSteps) {
      console.log("Usuário não está na última etapa.");
      return;
    }
    setIsLoading(true);
    setError(null);

    if (!validateStep(currentStep)) {
      setIsLoading(false);
      return;
    }

    try {
      // Mapear faixas de renda para valores numéricos
      const incomeMap: { [key: string]: number } = {
        "até 10.000": 10000.0,
        "10.001-30.000": 20000.0,
        "30.001-50.000": 40000.0,
        "50.001-80.000": 65000.0,
        "acima de 80.000": 100000.0,
      };

      // Formata o telefone para o padrão +55 (XX) XXXXX-XXXX
      const formatPhoneToBR = (phone: string) => {
        const digits = phone.replace(/\D/g, "");
        if (digits.length === 11) {
          return `+55 (${digits.slice(0, 2)}) ${digits.slice(
            2,
            7
          )}-${digits.slice(7, 11)}`;
        }
        return phone;
      };

      // Formata o CPF para o padrão XXX.XXX.XXX-XX
      const formatCPFToBR = (cpf: string) => {
        const digits = cpf.replace(/\D/g, "");
        if (digits.length === 11) {
          return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
            6,
            9
          )}-${digits.slice(9, 11)}`;
        }
        return cpf;
      };

      const payload: Register = {
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        telefone: formatPhoneToBR(formData.telefone),
        cpf: formatCPFToBR(formData.cpf),
        data_nascimento: formData.data_nascimento,
        cep: formData.cep.replace(/\D/g, ""),
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento || undefined,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        renda_mensal: incomeMap[formData.renda_mensal as number] || undefined,
        tem_patrimonio: formData.tem_patrimonio,
        conhecimento_investimento: formData.conhecimento_investimento as
          | "beginner"
          | "intermediate"
          | "advanced",
        aceita_termos: formData.aceita_termos,
      };

      console.log("Payload enviado:", payload);

      await authAPI.register(payload);
      const response = await authAPI.login(formData.email, formData.password);
      localStorage.setItem("auth_token", response.auth_token);
      router.push("/dashboard");
    } catch (err: any) {
      let errorMessage =
        "Falha no registro. Verifique os dados e tente novamente.";
      const errorData = err.response?.data;
      if (errorData) {
        const messages = Object.entries(errorData)
          .map(
            ([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
          )
          .join("; ");
        if (messages) errorMessage = messages;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 md:py-10 relative overflow-hidden">
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

      <div className="relative z-20 w-full max-w-2xl mx-auto">
        <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0a1a1f] to-[#1e4a5a]"></div>

            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="flex justify-center items-center mb-6 md:mb-8">
                <img
                  src="/logos/w1-tagline.png"
                  alt="Logo"
                  className="w-auto h-12 md:h-18 object-contain"
                />
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-[#0a1a1f] mb-1 md:mb-2 text-center md:text-left">
                Crie sua conta
              </h1>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 text-center md:text-left">
                Preencha seus dados para iniciar sua jornada financeira
              </p>

              <div className="w-full mb-8">
                <div className="flex justify-between mb-2">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        currentStep > index + 1
                          ? "bg-[#0a1a1f] text-white"
                          : currentStep === index + 1
                          ? "bg-[#1e4a5a] text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      {currentStep > index + 1 ? (
                        <CheckCircle size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-full bg-gray-400/30 h-2 rounded-full">
                  <div
                    className="bg-gradient-to-r from-[#0a1a1f] to-[#1e4a5a] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
                <div className="hidden md:flex justify-between mt-2 text-xs text-gray-600">
                  <span>Dados Pessoais</span>
                  <span>Endereço</span>
                  <span>Perfil Financeiro</span>
                </div>
                <div className="flex md:hidden justify-center mt-2">
                  <span className="text-xs text-gray-600">
                    {currentStep === 1 && "Dados Pessoais"}
                    {currentStep === 2 && "Endereço"}
                    {currentStep === 3 && "Perfil Financeiro"}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <User size={18} />
                        </div>
                        <input
                          type="text"
                          name="nome"
                          placeholder="Nome"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.nome}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <User size={18} />
                        </div>
                        <input
                          type="text"
                          name="sobrenome"
                          placeholder="Sobrenome"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.sobrenome}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <Lock size={18} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Senha"
                          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <Lock size={18} />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="password_confirm"
                          placeholder="Confirmar senha"
                          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.password_confirm}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <Calendar size={18} />
                        </div>
                        <input
                          type="date"
                          name="data_nascimento"
                          placeholder="Data de nascimento"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.data_nascimento}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <CreditCard size={18} />
                        </div>
                        <input
                          type="text"
                          name="cpf"
                          placeholder="CPF"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.cpf}
                          onChange={handleCPFChange}
                          maxLength={14}
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Phone size={18} />
                      </div>
                      <input
                        type="text"
                        name="telefone"
                        placeholder="Telefone"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                        value={formData.telefone}
                        onChange={handlePhoneChange}
                        maxLength={15}
                        required
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <MapPin size={18} />
                      </div>
                      <input
                        type="text"
                        name="cep"
                        placeholder="CEP"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                        value={formData.cep}
                        onChange={handleCEPChange}
                        maxLength={9}
                        required
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Home size={18} />
                      </div>
                      <input
                        type="text"
                        name="rua"
                        placeholder="Endereço"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                        value={formData.rua}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative">
                        <input
                          type="text"
                          name="numero"
                          placeholder="Número"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.numero}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          name="complemento"
                          placeholder="Complemento"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.complemento}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <Building size={18} />
                      </div>
                      <input
                        type="text"
                        name="bairro"
                        placeholder="Bairro"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                        value={formData.bairro}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="relative">
                        <input
                          type="text"
                          name="cidade"
                          placeholder="Cidade"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.cidade}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative">
                        <select
                          name="estado"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                          value={formData.estado}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione o estado</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <DollarSign size={18} />
                      </div>
                      <select
                        name="renda_mensal"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a1a1f]/50 focus:border-transparent transition-all duration-200"
                        value={formData.renda_mensal}
                        onChange={handleChange}
                      >
                        <option value="">Selecione sua renda mensal</option>
                        <option value="até 10.000">Até R$ 10.000</option>
                        <option value="10.001-30.000">
                          R$ 10.001 a R$ 30.000
                        </option>
                        <option value="30.001-50.000">
                          R$ 30.001 a R$ 50.000
                        </option>
                        <option value="50.001-80.000">
                          R$ 50.001 a R$ 80.000
                        </option>
                        <option value="acima de 80.000">
                          Acima de R$ 80.000
                        </option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qual seu nível de conhecimento em investimentos?
                      </label>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="flex items-center p-3 border border-gray-200 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="conhecimento_investimento"
                            value="beginner"
                            checked={
                              formData.conhecimento_investimento === "beginner"
                            }
                            onChange={handleChange}
                            className="h-4 w-4 text-[#0a1a1f] border-gray-300 focus:ring-[#0a1a1f]"
                          />
                          <span className="ml-2 text-sm">Iniciante</span>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="conhecimento_investimento"
                            value="intermediate"
                            checked={
                              formData.conhecimento_investimento ===
                              "intermediate"
                            }
                            onChange={handleChange}
                            className="h-4 w-4 text-[#0a1a1f] border-gray-300 focus:ring-[#0a1a1f]"
                          />
                          <span className="ml-2 text-sm">Intermediário</span>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="conhecimento_investimento"
                            value="advanced"
                            checked={
                              formData.conhecimento_investimento === "advanced"
                            }
                            onChange={handleChange}
                            className="h-4 w-4 text-[#0a1a1f] border-gray-300 focus:ring-[#0a1a1f]"
                          />
                          <span className="ml-2 text-sm">Avançado</span>
                        </label>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="aceita_termos"
                          checked={formData.aceita_termos}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#0a1a1f] border-gray-300 rounded focus:ring-[#0a1a1f]"
                          required
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Concordo com os{" "}
                          <Link
                            href="/terms"
                            className="text-[#0a1a1f] hover:underline"
                          >
                            Termos de Uso
                          </Link>{" "}
                          e{" "}
                          <Link
                            href="/privacy"
                            className="text-[#0a1a1f] hover:underline"
                          >
                            Política de Privacidade
                          </Link>
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-red-700 text-md mt-4 text-center font-medium">
                    {error}
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 border border-[#0a1a1f] text-[#0a1a1f] rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base"
                    >
                      <ChevronLeft size={16} />
                      <span>Voltar</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 border border-[#0a1a1f] text-[#0a1a1f] rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base"
                    >
                      <ChevronLeft size={16} />
                      <span>Login</span>
                    </Link>
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex cursor-pointer items-center gap-1 md:gap-2 px-4 md:px-6 py-2 bg-gradient-to-r from-[#0a1a1f] to-[#152c35] text-white rounded-lg hover:from-[#152c35] hover:to-[#1e4a5a] transition-all duration-300 text-sm md:text-base"
                    >
                      <span>Próximo</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading || !formData.aceita_termos}
                      className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2 bg-gradient-to-r from-[#0a1a1f] to-[#152c35] text-white rounded-lg hover:from-[#152c35] hover:to-[#1e4a5a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <>
                          <span>Finalizar cadastro</span>
                          <CheckCircle size={16} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
