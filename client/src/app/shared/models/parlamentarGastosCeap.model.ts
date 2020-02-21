export interface GastosCeap {
  categoria: string;
  especificacao: string;
  dataEmissao: Date;
  fornecedor: string;
  valor_gasto: number;
}

export interface ParlamentarGastosCeap {
  idParlamentarVoz: string;
  parlamentarGastosCeap: GastosCeap[];
}
