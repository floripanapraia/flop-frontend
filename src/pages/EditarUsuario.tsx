import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditarUsuario: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "Victoria Fernandes Galvão",
    email: "victoriafernandes@gmail.com",
    user: "vicfernandes",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nome ||
      !form.email ||
      !form.user ||
      !form.senha ||
      !form.confirmarSenha
    ) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      // TODO: lógica de salvar no backend
      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar alterações.");
    }
  };

  const handleLogout = () => {
    // TODO: lógica de logout
    navigate("/login");
  };

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
                  alt="Ícone de logout"
                  className="w-5 h-5"
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-2 mb-6 text-blue-900">
              Olá, Kurinho!
            </h2>

            <button
              onClick={handleLogout}
              className="w-40 bg-gray-100 py-2 rounded-lg shadow text-sm text-blue-900 flex items-center justify-center gap-2 mb-4"
            >
             
              Sair
            </button>

            <button
              // onClick={handleDelete}
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
              <p className="border-b pb-1">{form.user}</p>
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
            >
              Salvar alterações
            </button>
          </form>
        </div>
      </div>
      
      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-6 left-6 bg-blue-900 text-white px-5 py-2 rounded-full text-sm shadow-2x1 z-20 "
      >
        Voltar
      </button>
    </div>
  );
};

export default EditarUsuario;
