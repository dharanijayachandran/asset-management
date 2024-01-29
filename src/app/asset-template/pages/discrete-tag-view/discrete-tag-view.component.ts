import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discrete-tag-view',
  templateUrl: './discrete-tag-view.component.html',
  styleUrls: ['./discrete-tag-view.component.css']
})
export class DiscreteTagViewComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  @Output() navigateTemplate = new EventEmitter();
  // backButton form level
  backButton(event) {
    this.navigateTemplate.emit('discreteTagList');
  }
}
