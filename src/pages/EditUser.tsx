import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCurrentUser, updateUser, deleteUser } from "../services/userService";
import { setAuthToken } from "../services/authService";
import axios from 'axios';

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    username: "",
    senha: "",
    confirmarSenha: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUserId(userData.id);
        setForm({
          nome: userData.nome,
          email: userData.email,
          username: userData.username,
          senha: "",
          confirmarSenha: "",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Erro ao carregar dados do usuário");
        // Redirect to login if unauthorized
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password fields if user is changing password
    if (form.senha || form.confirmarSenha) {
      if (!form.senha || !form.confirmarSenha) {
        toast.error("Por favor, preencha ambos os campos de senha.");
        return;
      }

      if (form.senha !== form.confirmarSenha) {
        toast.error("As senhas informadas não coincidem.");
        return;
      }
    }

    if (!userId) {
      toast.error("Usuário não encontrado.");
      return;
    }

    try {
      setLoading(true);

      // Only include fields that should be updated
      const updateData: any = {};

      // Only update password if provided
      if (form.senha) {
        updateData.senha = form.senha;
      }

      // Update user data
      await updateUser(userId, updateData);
      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;

    // Confirm before deleting
    if (window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      try {
        setLoading(true);
        await deleteUser(userId);
        toast.success("Conta excluída com sucesso");
        // Clear auth token and redirect to login
        setAuthToken(null);
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Erro ao excluir conta");
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
      {/* Imagem de fundo */}
      <img
        src="/assets/FlopBG.png"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Container central com conteúdo */}
      <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-6xl p-10">
        <h1 className="text-2xl font-semibold mb-6 border-b-2 border-[#253F64] text-[#253F64]">
          Gerenciar meus dados
        </h1>

        <div className="flex flex-col lg:flex-row">
          {/* Coluna esquerda */}
          <div className="flex flex-col items-center w-full lg:w-1/3 mb-10 lg:mb-0">
            <div className="relative">
              <img
                src="/assets/kuro.png"
                alt="Perfil"
                className="w-36 h-36 object-cover rounded-full mb-2"
              />
              <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow">
                <img
                  src="/assets/Edit.png"
                  alt="Ícone de editar"
                  className="w-5 h-5"
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-2 mb-6 text-blue-900">
              Olá, {form.username}!
            </h2>

            <button
              onClick={handleLogout}
              className="w-40 bg-gray-100 py-2 rounded-lg shadow text-sm text-blue-900 flex items-center justify-center gap-2 mb-4"
            >
              Sair
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-40 bg-gray-100 py-2 rounded-lg text-sm text-blue-900 shadow"
            >
              Deletar conta
            </button>
          </div>

          {/* Coluna direita */}
          <form
            onSubmit={handleSubmit}
            className="w-full lg:w-2/3 px-0 lg:px-10 flex flex-col gap-4"
          >
            <div>
              <label className="text-sm block text-[#1f2a4d]">Nome:</label>
              <p className="border-b pb-1">{form.nome}</p>
            </div>

            <div>
              <label className="text-sm block text-[#1f2a4d]">Email:</label>
              <p className="border-b pb-1">{form.email}</p>
            </div>

            <div>
              <label className="text-sm block text-[#1f2a4d]">User:</label>
              <p className="border-b pb-1">{form.username}</p>
            </div>

            <div>
              <label className="text-sm block text-[#1f2a4d]">Senha:</label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200"
                placeholder="Nova senha"
              />
            </div>

            <div>
              <label className="text-sm block text-[#1f2a4d]">
                Confirmar senha:
              </label>
              <input
                name="confirmarSenha"
                type="password"
                value={form.confirmarSenha}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200"
                placeholder="Confirmar nova senha"
              />
            </div>

            <button
              type="submit"
              className="mt-6 self-start bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-[#142038] transition shadow-lg"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-6 left-6 bg-blue-900 text-white px-5 py-2 rounded-full text-sm shadow-2x1 z-20"
      >
        Voltar
      </button>
    </div>
  );
};

export default EditUser;