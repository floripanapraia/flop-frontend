import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import { createUser } from '../services/api';
import { toast } from 'react-toastify';

interface FormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Username é obrigatório';
    if (!formData.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não conferem';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Você deve aceitar os termos de serviço';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      try {
        await createUser({
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        navigate('/login');
      } catch (error) {
        console.error('Error creating account:', error);
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    }
  };

  const goBack = () => {
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl text-center text-blue-600 mb-6">Criando minha conta</h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="User"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            helperText="Como outros te verão na plataforma."
          />

          <Input
            label="Nome completo"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Input
            label="Confirme senha"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            label={
              <span>
                <a href="/terms" className="text-blue-600 underline">Termos de Serviço e Privacidade</a>
              </span>
            }
            error={errors.acceptTerms}
          />

          <div className="mt-6">
            <Button type="submit" fullWidth>Criar</Button>
          </div>
        </form>
      </div>

      <button
        onClick={goBack}
        className="absolute bottom-8 left-8 bg-blue-900 text-white px-6 py-2 rounded-md"
      >
        Voltar
      </button>
    </div>
  );
};

export default CreateAccount;