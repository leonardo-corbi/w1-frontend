"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { CustomUser } from "@/types/CustomUser";

export default function ProfilePage() {
  const [profile, setProfile] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CustomUser>>({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    cpf: "",
    data_nascimento: "",
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
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setProfile(response.data);
        setFormData({
          nome: response.data.nome || "",
          sobrenome: response.data.sobrenome || "",
          email: response.data.email || "",
          telefone: response.data.telefone || "",
          cpf: response.data.cpf || "",
          data_nascimento: response.data.data_nascimento || "",
          cep: response.data.cep || "",
          rua: response.data.rua || "",
          numero: response.data.numero || "",
          complemento: response.data.complemento || "",
          bairro: response.data.bairro || "",
          cidade: response.data.cidade || "",
          estado: response.data.estado || "",
          renda_mensal: response.data.renda_mensal,
          tem_patrimonio: response.data.tem_patrimonio || false,
          conhecimento_investimento:
            response.data.conhecimento_investimento || "beginner",
        });
      } catch (err) {
        setError("Falha ao carregar perfil. Por favor, tente novamente.");
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "renda_mensal") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUpdateSuccess(false);

    try {
      await authAPI.updateProfile(formData);
      setProfile((prev) => (prev ? { ...prev, ...formData } : null));
      setIsEditing(false);
      setUpdateSuccess(true);

      // Esconde a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Falha ao atualizar perfil. Verifique os dados e tente novamente."
      );
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Carregando...</span>
          </div>
          <p className="mt-2">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  const getConhecimentoLabel = (value: string) => {
    const options = {
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
    };
    return options[value as keyof typeof options] || value;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Perfil do Usuário
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Informações pessoais e detalhes da conta
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sair
            </button>
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 my-2"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {updateSuccess && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-4 my-2"
            role="alert"
          >
            <span className="block sm:inline">
              Perfil atualizado com sucesso!
            </span>
          </div>
        )}

        {isEditing ? (
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 px-4 py-5 sm:p-6"
          >
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Dados Pessoais
                </h3>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="sobrenome"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sobrenome
                </label>
                <input
                  type="text"
                  name="sobrenome"
                  id="sobrenome"
                  value={formData.sobrenome}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  id="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="cpf"
                  className="block text-sm font-medium text-gray-700"
                >
                  CPF
                </label>
                <input
                  type="text"
                  name="cpf"
                  id="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="data_nascimento"
                  className="block text-sm font-medium text-gray-700"
                >
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="data_nascimento"
                  id="data_nascimento"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Endereço
                </h3>
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="cep"
                  className="block text-sm font-medium text-gray-700"
                >
                  CEP
                </label>
                <input
                  type="text"
                  name="cep"
                  id="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="rua"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rua
                </label>
                <input
                  type="text"
                  name="rua"
                  id="rua"
                  value={formData.rua}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="numero"
                  className="block text-sm font-medium text-gray-700"
                >
                  Número
                </label>
                <input
                  type="text"
                  name="numero"
                  id="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="complemento"
                  className="block text-sm font-medium text-gray-700"
                >
                  Complemento
                </label>
                <input
                  type="text"
                  name="complemento"
                  id="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="bairro"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bairro
                </label>
                <input
                  type="text"
                  name="bairro"
                  id="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="cidade"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  id="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-1">
                <label
                  htmlFor="estado"
                  className="block text-sm font-medium text-gray-700"
                >
                  Estado
                </label>
                <input
                  type="text"
                  name="estado"
                  id="estado"
                  maxLength={2}
                  value={formData.estado}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Dados Financeiros
                </h3>
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="renda_mensal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Renda Mensal
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="renda_mensal"
                  id="renda_mensal"
                  value={formData.renda_mensal || ""}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="conhecimento_investimento"
                  className="block text-sm font-medium text-gray-700"
                >
                  Conhecimento em Investimentos
                </label>
                <select
                  id="conhecimento_investimento"
                  name="conhecimento_investimento"
                  value={formData.conhecimento_investimento}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                >
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Patrimônio
                </label>
                <div className="mt-4">
                  <div className="flex items-center">
                    <input
                      id="tem_patrimonio"
                      name="tem_patrimonio"
                      type="checkbox"
                      checked={formData.tem_patrimonio}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded text-black"
                    />
                    <label
                      htmlFor="tem_patrimonio"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Possuo patrimônio
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Salvar
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Nome completo
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile?.nome} {profile?.sobrenome}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile?.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">CPF</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile?.cpf}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile?.telefone}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Data de Nascimento
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile?.data_nascimento
                    ? new Date(profile.data_nascimento).toLocaleDateString(
                        "pt-BR"
                      )
                    : ""}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile?.rua}, {profile?.numero}
                  {profile?.complemento ? `, ${profile.complemento}` : ""}
                  <br />
                  {profile?.bairro}, {profile?.cidade} - {profile?.estado},{" "}
                  {profile?.cep}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Renda Mensal
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile?.renda_mensal !== undefined &&
                  profile?.renda_mensal !== null &&
                  !isNaN(Number(profile.renda_mensal))
                    ? `R$ ${Number(profile.renda_mensal)
                        .toFixed(2)
                        .replace(".", ",")}`
                    : "Não informado"}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Possui Patrimônio
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile?.tem_patrimonio ? "Sim" : "Não"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Conhecimento em Investimentos
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile?.conhecimento_investimento
                    ? getConhecimentoLabel(profile.conhecimento_investimento)
                    : ""}
                </dd>
              </div>
            </dl>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
