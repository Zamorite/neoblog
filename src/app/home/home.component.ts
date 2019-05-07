import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  categories = [
    {
      link: 'math.jpg',
      name: 'mathematics',
      field: 'sciences'
    },
    {
      link: 'eng.jpg',
      name: 'english language',
      field: 'arts'
    },
    {
      link: 'phx.jpg',
      name: 'physics',
      field: 'sciences'
    },
    {
      link: 'com.jpg',
      name: 'commerce',
      field: 'commercials'
    },
    {
      link: 'chem.png',
      name: 'chemistry',
      field: 'sciences'
    },
    {
      link: 'lit.png',
      name: 'literature',
      field: 'arts'
    },
    {
      link: 'bio.jpg',
      name: 'biology',
      field: 'sciences'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
