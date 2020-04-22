import { Partido } from './partido.model';

export class Parlamentar {

  public idParlamentarVoz: string;
  public idParlamentar: string;
  public casa: string;
  public nomeEleitoral: string;
  public uf: string;
  public parlamentarPartido: Partido;
  public genero: string;
  public emExercicio: boolean;
  public votacoes: any;
  public alinhamento?: any;

  constructor(parlamentar: any) {
    this.idParlamentarVoz = parlamentar.id_parlamentar_voz;
    this.idParlamentar = parlamentar.id_parlamentar;
    this.casa = parlamentar.casa;
    this.nomeEleitoral = parlamentar.nome_eleitoral;
    this.uf = parlamentar.uf;
    this.parlamentarPartido = parlamentar.parlamentarPartido;
    this.genero = parlamentar.genero;
    this.emExercicio = parlamentar.em_exercicio;
    this.votacoes = parlamentar.votacoes;
    this.alinhamento = parlamentar.alinhamento;
  }

  getFoto(): string {
    return 'https://www.camara.leg.br/internet/deputado/bandep/' + this.idParlamentar + '.jpg';
  }
}
