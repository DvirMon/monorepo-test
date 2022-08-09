import { Component, OnInit } from '@angular/core';
import { takeUntilDestroy$ } from 'projects/test-lib/src/public-api';
import { interval } from 'rxjs';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {


  // source$ = interval(1000).pipe(takeUntilDestroy$())

  constructor() { }

  ngOnInit(): void {

    // this.source$.subscribe((value) => console.log('timer', value));

  }

}
