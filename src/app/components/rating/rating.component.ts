import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {

  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  rate(index: number) {
    this.rating = index
    this.ratingChange.emit(this.rating)
  }

  getColor(index: number) {
    if (this.isAboveRating(index))
      return "#8e9c98"
    else
      return "#fff387"
  }

  isAboveRating(index: number): boolean {
    return index > this.rating
  }

}