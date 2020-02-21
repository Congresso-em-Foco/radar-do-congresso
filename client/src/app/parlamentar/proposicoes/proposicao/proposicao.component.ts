import { Component, OnInit, Input } from '@angular/core';

import { ProposicaoInfo } from '../../../shared/models/proposicaoInfo.model';

@Component({
  selector: 'app-proposicao',
  templateUrl: './proposicao.component.html',
  styleUrls: ['./proposicao.component.scss']
})
export class ProposicaoComponent implements OnInit {


  @Input() proposicao: ProposicaoInfo;

  constructor() { }

  ngOnInit() { }

  getUrlProposicao(id: string, casa: string): string {
    const camaraUrl = 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=';
    const senadoUrl = 'https://www25.senado.leg.br/web/atividade/materias/-/materia/';

    let url;

    if (casa === 'camara') {
      url = camaraUrl;
    } else {
      url = senadoUrl;
    }

    return url + id;
  }

}
