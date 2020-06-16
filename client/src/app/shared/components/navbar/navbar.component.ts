import * as myGlobals from '../../../globals';

import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CasaService } from '../../services/casa.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public dataAtualizacao: string = myGlobals.dataAtualizacao;

  private unsubscribe = new Subject();

  casa: string;

  constructor(public casaService: CasaService) { }

  ngOnInit() {
    this.casaService.get().pipe(takeUntil(this.unsubscribe)).subscribe(casa => this.casa = casa);
  }

  getCasa() {
    return this.casa;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
