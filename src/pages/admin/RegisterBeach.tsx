import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { createPraia } from '../../services/beachService';

interface PraiaCadastroData {
  nomePraia: string;
  latitude: string;
  longitude: string;
  placeId: string;
}

const RegisterBeach: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PraiaCadastroData>({
    nomePraia: '',
    latitude: '',
    longitude: '',
    placeId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nomePraia.trim()) {
      alert('Nome da praia é obrigatório');
      return;
    }

    if (!formData.latitude.trim() || !formData.longitude.trim()) {
      alert('Coordenadas são obrigatórias');
      return;
    }

    // Validar se latitude e longitude são números válidos
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Coordenadas devem ser números válidos');
      return;
    }

    if (lat < -90 || lat > 90) {
      alert('Latitude deve estar entre -90 e 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      alert('Longitude deve estar entre -180 e 180');
      return;
    }

    setLoading(true);

    try {
      await createPraia({
        idPraia: 0, // O backend deve gerar o ID sozinho
        nomePraia: formData.nomePraia,
        latitude: lat,
        longitude: lng,
        placeId: formData.placeId,
        imagem: '',
        imagensPostagens: [],
        totalAvaliacoesDoDia: 0,
        mensagensPostagens: [],
        condicoesAvaliacoes: {},
      });

      toast.success('Praia cadastrada com sucesso!');
      navigate('/admin/praias');
    } catch (error) {
      console.error('Erro ao cadastrar praia:', error);
      toast.error('Erro ao cadastrar praia. Tente novamente.');
    }
    
  };

  const handleVoltar = () => {
    navigate('/admin/praias');
  };

  const handleObterLocalizacao = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setLoading(false);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Erro ao obter localização. Insira as coordenadas manualmente.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocalização não é suportada neste navegador');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleVoltar}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para lista de praias
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Cadastrar praia</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nome da Praia */}
          <div>
            <label htmlFor="nomePraia" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da praia *
            </label>
            <input
              type="text"
              id="nomePraia"
              name="nomePraia"
              value={formData.nomePraia}
              onChange={handleInputChange}
              placeholder="Digite o nome da praia"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Place ID */}
          <div>
            <label htmlFor="placeId" className="block text-sm font-medium text-gray-700 mb-2">
              Place ID (Google)
            </label>
            <input
              type="text"
              id="placeId"
              name="placeId"
              value={formData.placeId}
              onChange={handleInputChange}
              placeholder="ID do local no Google Maps (opcional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Coordenadas Geográficas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Coordenadas geográficas *
              </label>
              <button
                type="button"
                onClick={handleObterLocalizacao}
                disabled={loading}
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MapPin className="w-4 h-4 mr-1" />
                {loading ? 'Obtendo...' : 'Usar minha localização'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-xs text-gray-500 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="-27.5954"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-xs text-gray-500 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="-48.5480"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use formato decimal (ex: -27.5954, -48.5480)
            </p>
          </div>

          {/* Botão de Submit */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[120px]"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterBeach;