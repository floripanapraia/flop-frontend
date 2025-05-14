import apiClient from "./api";

export interface PraiaDTO {
  idPraia: number;
  nomePraia: string;
  imagem: string;
  latitude: number;
  longitude: number;
  placeId: string;
  mensagensPostagens: string[];
  imagensPostagens: string[];
  condicoesAvaliacoes: Record<string, number>;
}

interface SeletorFiltro {
  nomePraia?: string;
}

export const createPraia = async (praiaData: PraiaDTO): Promise<PraiaDTO> => {
  try {
    const response = await apiClient.post<PraiaDTO>(
      "/praias/cadastrar",
      praiaData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar praia:", error);
    throw error;
  }
};

export const deletePraia = async (praiaId: number): Promise<void> => {
  try {
    await apiClient.delete(`/praias/excluir/${praiaId}`);
  } catch (error) {
    console.error("Erro ao excluir praia:", error);
    throw error;
  }
};

export const updatePraia = async (
  praiaId: number,
  praiaData: Partial<PraiaDTO>
): Promise<PraiaDTO> => {
  try {
    const response = await apiClient.put<PraiaDTO>(
      `/praias/editar/${praiaId}`,
      praiaData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar praia:", error);
    throw error;
  }
};

export const getAllPraias = async (): Promise<PraiaDTO[]> => {
  try {
    const response = await apiClient.get<PraiaDTO[]>("/praias/todos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar praias:", error);
    throw error;
  }
};

export const getPraiaById = async (praiaId: number): Promise<PraiaDTO> => {
  try {
    const response = await apiClient.get<PraiaDTO>(`/praias/${praiaId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar praia por ID:", error);
    throw error;
  }
};

export const filterPraias = async (
  seletor: SeletorFiltro
): Promise<PraiaDTO[]> => {
  try {
    const response = await apiClient.post<{ content: PraiaDTO[] }>(
      "/praias/filtrar",
      seletor
    );
    return response.data.content;
  } catch (error) {
    console.error("Erro ao filtrar praias:", error);
    throw error;
  }
};

export const getPraiaNow = async (praiaId: number): Promise<PraiaDTO> => {
  try {
    const response = await apiClient.get<PraiaDTO>(`/praias/${praiaId}/now`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar  praia:", error);
    throw error;
  }
};
