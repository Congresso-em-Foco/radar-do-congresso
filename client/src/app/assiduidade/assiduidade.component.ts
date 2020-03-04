import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AssiduidadeService } from '../shared/services/assiduidade.service';
import { Assiduidade } from '../shared/models/assiduidade.model';

@Component({
  selector: 'app-assiduidade',
  templateUrl: './assiduidade.component.html',
  styleUrls: ['./assiduidade.component.scss']
})
export class AssiduidadeComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  public assiduidade: Assiduidade[];

  constructor(private assiduidadeService: AssiduidadeService) { }

  ngOnInit() {
    this.getAssiduidade();
  }

  getAssiduidade() {
    this.assiduidadeService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        assiduidade => {
          this.assiduidade = assiduidade;
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
