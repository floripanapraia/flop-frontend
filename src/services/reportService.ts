import apiClient from "./api";

// Enums
export enum MotivosDenuncia {
  INADEQUADO = "INADEQUADO",
  INCORRETO = "INCORRETO",
  SPAM_PROPAGANDA = "SPAM_PROPAGANDA",
  ILEGAL = "ILEGAL",
  VIOLACAO_PRIVACIDADE = "VIOLACAO_PRIVACIDADE",
}

export enum StatusDenuncia {
  PENDENTE = "PENDENTE",
  ACEITA = "ACEITA",
  RECUSADA = "RECUSADA",
}

// Interfaces
export interface DenunciaDTO {
  id?: number;
  nomeDenunciante: string;
  postagemId: number;
  textoPostagem: string;
  imagemPostagem: string;
  usuarioId: number;
  nomeUsuario: string;
  motivo: MotivosDenuncia;
  status: StatusDenuncia;
  criadoEm: string;
}

export interface DenunciaAgrupada {
  postagemId: number;
  nomeUsuario: string;
  textoPostagem: string;
  imagemPostagem: string;
  denuncias: DenunciaDTO[];
  totalDenuncias: number;
  statusGeral: StatusDenuncia;
  primeiraData: string;
  motivosPrincipais: MotivosDenuncia[];
}

export interface SeletorFiltro {
  dataInicio?: string;
  dataFim?: string;
  motivoDenuncia?: MotivosDenuncia;
  nomeAutor?: string;
}

export const getAllDenuncias = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get<any[]>("/denuncias/todas");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar denúncias:", error);
    throw error;
  }
};

export const getDenunciaById = async (denunciaId: number): Promise<DenunciaDTO> => {
  try {
    const response = await apiClient.get<DenunciaDTO>(`/denuncias/${denunciaId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar denúncia por ID:", error);
    throw error;
  }
};

export const filterDenuncias = async (
  seletor: SeletorFiltro
): Promise<DenunciaDTO[]> => {
  try {
    const response = await apiClient.post<DenunciaDTO[]>(
      "/denuncias/filtrar",
      seletor
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao filtrar denúncias:", error);
    throw error;
  }
};

export const analisarDenunciasPostagem = async (
  postagemId: number,
  novoStatus: StatusDenuncia
): Promise<void> => {
  try {
    await apiClient.put<void>(
      `/denuncias/analisar/postagem/${postagemId}`,
      { novoStatus }
    );
  } catch (error) {
    console.error("Erro ao analisar denúncias da postagem:", error);
    throw error;
  }
};