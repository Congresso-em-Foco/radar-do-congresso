export interface Assiduidade {
  ano: string;
  parlamentares: any[];
}

export interface AssiduidadeParlamentar {
  ano: string;
  totalSessoesDeliberativas: string;
  totalPresenca: string;
  totalAusenciasJustificadas: string;
  totalAusenciasNaoJustificadas: string;
}

export interface ParlamentarAssiduidade {
  idParlamentarVoz: string;
  parlamentarAssiduidade: AssiduidadeParlamentar[];
}
