import { Component, OnInit, Input } from '@angular/core';
import * as myGlobals from '../../../globals';
@Component({
  selector: 'app-titleheader',
  templateUrl: './titleheader.component.html',
  styleUrls: ['./titleheader.component.scss']
})
export class TitleheaderComponent implements OnInit {
  @Input() customTitle: string;
  public dataAtualizacao: string = myGlobals.dataAtualizacao;
  constructor() {}
  ngOnInit() {}
}
