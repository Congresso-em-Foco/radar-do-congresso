import { Component, OnInit, Input } from '@angular/core';

import { Discurso } from 'src/app/shared/models/discurso.model';

@Component({
  selector: 'app-discurso',
  templateUrl: './discurso.component.html',
  styleUrls: ['./discurso.component.scss']
})
export class DiscursoComponent implements OnInit {

  @Input() discurso: Discurso;

  constructor() { }

  ngOnInit() {
  }

}
