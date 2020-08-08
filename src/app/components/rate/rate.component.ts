import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
})
export class RateComponent implements OnInit {

  @Input() rating: number;
  @Output() ratingChange = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  rate(index: number) {
    this.rating = index
    this.ratingChange.emit(this.rating)
  }

  getColor(num) {
    if (this.isAboveRating(num))
      return "#8e9c98"
    else
      return "#fff387"
  }

  isAboveRating(index: number): boolean {
    return index > this.rating
  }

}