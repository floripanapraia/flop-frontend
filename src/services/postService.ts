import apiClient from "./api";

export interface PostagemDTO {
  idPostagem?: number;
  idUsuario:number;
  nickname: string;
  idPraia: number;
  nomePraia: string;
  criadoEm: string;
  imagem: string;
  mensagem: string;
  excluida: string;
}

export interface PostagemSeletor {
  titulo?: string;
  descricao?: string;
  idUsuario?: number;
  criadoEmInicio?: string;
  criadoEmFim?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const createPostagem = async (
  postagemData: Omit<PostagemDTO, "idPostagem" | "criadoEm" | "usuario">
): Promise<PostagemDTO> => {
  try {
    const response = await apiClient.post<PostagemDTO>(
      "/postagens/cadastrar",
      postagemData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar postagem:", error);
    throw error;
  }
};

export const uploadImagemPostagem = async (
  foto: File | FormData,
  idPostagem: number
): Promise<void> => {
  try {
    const formData = new FormData();

    if (foto instanceof File) {
      formData.append("fotoDePerfil", foto);
    } else {
      // Se já é FormData, assume que já tem os campos necessários
      foto.append("IdPostagem", idPostagem.toString());
      await apiClient.post("/postagens/salvar-foto", foto, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return;
    }

    formData.append("IdPostagem", idPostagem.toString());

    await apiClient.post("/postagens/salvar-foto", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
};

export const getAllPostagens = async (): Promise<PostagemDTO[]> => {
  try {
    const response = await apiClient.get<PostagemDTO[]>("/postagens/todos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todas as postagens:", error);
    throw error;
  }
};

export const getPostagemById = async (
  postagemId: number
): Promise<PostagemDTO> => {
  try {
    const response = await apiClient.get<PostagemDTO>(
      `/postagens/${postagemId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar postagem por ID:", error);
    throw error;
  }
};

export const filterPostagens = async (
  seletor: PostagemSeletor
): Promise<PostagemDTO[]> => {
  try {
    const response = await apiClient.post<PostagemDTO[]>(
      "/postagens/filtrar",
      seletor
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao filtrar postagens:", error);
    throw error;
  }
};

export const getTotalPaginas = async (
  seletor: PostagemSeletor
): Promise<number> => {
  try {
    const response = await apiClient.post<number>(
      "/postagens/total-paginas",
      seletor
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao contar páginas:", error);
    throw error;
  }
};
