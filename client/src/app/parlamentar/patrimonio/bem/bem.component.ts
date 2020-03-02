import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bem',
  templateUrl: './bem.component.html',
  styleUrls: ['./bem.component.scss']
})
export class BemComponent implements OnInit {

  @Input() bem;

  constructor() { }

  ngOnInit() {
  }

}
