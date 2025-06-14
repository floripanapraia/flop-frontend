import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import { setAuthToken } from "../services/authService";
import {
  deleteUser,
  getCurrentUser,
  updateUser,
  updateUserProfilePicture,
} from "../services/userService";
import { LogOut, Trash2 } from "lucide-react";

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isChangingPicture, setIsChangingPicture] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
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
          nome: userData.nome || "",
          email: userData.email || "",
          senha: "",
          confirmarSenha: "",
        });

        // Set profile picture if available
        if (userData.fotoPerfil) {
          setProfilePicture(userData.fotoPerfil);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Erro ao carregar dados do usuário");
        // Redirect to login if unauthorized
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/auth");
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

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem selecionada é muito grande. Tamanho máximo: 5MB");
      return;
    }

    setPictureFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setIsEditing(true);
      setProfilePicture(reader.result as string);
      setIsChangingPicture(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validations
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email é obrigatório");
      return;
    }

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

    try {
      setSaveLoading(true);

      // Prepare data for update
      const updateData: any = {
        nome: form.nome,
        email: form.email,
      };

      // Only include password if provided
      if (form.senha) {
        updateData.senha = form.senha;
      }

      // Include profile picture if changed
      if (isChangingPicture && profilePicture) {
        updateData.profilePicture = profilePicture;
      }

      // Update user data
      await updateUser(updateData);
      toast.success("Alterações salvas com sucesso!");
      setIsChangingPicture(false);

      // Reset password fields after successful update
      setForm({
        ...form,
        senha: "",
        confirmarSenha: "",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erro ao salvar alterações.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Function to handle the profile picture upload
  const handleSaveProfilePicture = async () => {
    if (!pictureFile) {
      return;
    }

    try {
      setUploadingPicture(true);

      await updateUserProfilePicture(pictureFile);

      toast.success("Foto de perfil atualizada com sucesso!");
      setIsChangingPicture(false);
      setPictureFile(null); // Reset the file state after successful upload
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Erro ao atualizar foto de perfil");
    } finally {
      setUploadingPicture(false);
    }
  };

  const performDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteUser();
      toast.success("Conta excluída com sucesso");
      // Clear auth token and redirect to login
      setAuthToken(null);
      navigate("/auth");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Erro ao excluir conta");
      setLoading(false);
    }
  };

 const handleLogout = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col items-center text-center gap-4">
          <p className="text-sm text-gray-800 font-medium">
            Deseja realmente sair?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => closeToast?.()}
              className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setAuthToken(null);
                closeToast?.();
                navigate("/auth");
              }}
              className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        icon: false,
      }
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
      {/* Background image */}
      <img
        src="/assets/FlopBG.png"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Main content container */}
      <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-6xl p-10">
        <h1 className="text-2xl font-semibold mb-6 border-b-2 border-[#253F64] text-[#253F64]">
          Gerenciar meus dados
        </h1>

        <div className="flex flex-col lg:flex-row">
          {/* Left column */}
          <div className="flex flex-col items-center w-full lg:w-1/3 mb-10 lg:mb-0">
            <div className="relative">
              {/* Profile picture with default fallback */}
              <img
                src={
                  isEditing
                    ? `${profilePicture}`
                    : `data:image/jpeg;base64,${profilePicture}`
                }
                alt="Perfil"
                className="w-36 h-36 object-cover rounded-full mb-2"
              />

              <label
                htmlFor="profile-picture-upload"
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer"
              >
                <img
                  src="/assets/Edit.png"
                  alt="Editar foto"
                  className="w-5 h-5"
                />
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>

            {/* Show save button if picture is being changed */}
            {isChangingPicture && (
              <div>
                <button
                  onClick={handleSaveProfilePicture}
                  className="w-40 bg-gray-100 py-2 rounded-lg shadow text-sm text-blue-900 flex items-center justify-center gap-2 mb-4"
                  disabled={uploadingPicture}
                >
                  {uploadingPicture ? "Salvando..." : "Salvar Foto"}
                </button>
              </div>
            )}

            <h2 className="text-lg font-semibold mt-2 mb-6 text-blue-900">
              Olá, {form.nome}!
            </h2>

            <button
              onClick={handleLogout}
              className="w-40 bg-gray-100 py-2 rounded-lg shadow text-sm text-blue-900 flex items-center justify-center gap-2 mb-4"
            >
              <LogOut size={18} />
              Sair
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-40 bg-gray-100 py-2 rounded-lg text-sm text-red-600 shadow hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Deletar conta
            </button>
          </div>

          {/* Right column - form */}
          <form
            onSubmit={handleSubmit}
            className="w-full lg:w-2/3 px-0 lg:px-10 flex flex-col gap-4"
          >
            <div>
              <label className="text-sm block text-[#1f2a4d]">Nome:</label>
              <input
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                maxLength={80}
              />
            </div>

            <div>
              <label className="text-sm block text-[#1f2a4d]">Email:</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                maxLength={100}
              />
            </div>

            <div>
              <label className="text-sm block text-[#1f2a4d]">
                Nova Senha:
              </label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Deixe em branco para manter a senha atual"
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault(); // Bloqueia a tecla de espaço
                  }
                }}
                minLength={8}
                maxLength={32}
              />
            </div>

            <div>
              <input
                name="confirmarSenha"
                type="password"
                value={form.confirmarSenha}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Confirme a nova senha"
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault(); // Bloqueia a tecla de espaço
                  }
                }}
                minLength={8}
                maxLength={32}
              />
            </div>

            <button
              type="submit"
              className="mt-6 self-start bg-blue-900 text-white py-2 px-6 rounded-full hover:bg-[#142038] transition shadow-lg"
              disabled={saveLoading}
            >
              {saveLoading ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-6 left-6 bg-blue-900 text-white px-5 py-2 rounded-full text-sm shadow-2x1 z-20"
      >
        Voltar
      </button>

      {/* Confirmation Modal for Account Deletion */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={performDeleteAccount}
        title="Excluir conta"
        message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão removidos permanentemente."
      />
    </div>
  );
};

export default EditUser;
