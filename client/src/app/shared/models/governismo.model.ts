export interface Governismo {
  ano: string;
  parlamentares: any[];
}

export interface GovernismoParlamentar {
  ano: string;
  totalSessoesDeliberativas: string;
  totalPresenca: string;
  totalAusenciasJustificadas: string;
  totalAusenciasNaoJustificadas: string;
}

export interface ParlamentarGovernismo {
  idParlamentarVoz: string;
  parlamentarGovernismo: GovernismoParlamentar[];
}
