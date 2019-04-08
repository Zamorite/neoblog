import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  categories = [
    {
      link: 'math',
      name: 'mathematics',
      field: 'sciences'
    },
    {
      link: 'eng',
      name: 'english language',
      field: 'arts'
    },
    {
      link: 'phy',
      name: 'physics',
      field: 'sciences'
    },
    {
      link: 'comm',
      name: 'commerce',
      field: 'commercials'
    },
    {
      link: 'chem',
      name: 'chemistry',
      field: 'sciences'
    },
    {
      link: 'lit',
      name: 'literature',
      field: 'arts'
    },
    {
      link: 'bio',
      name: 'biology',
      field: 'sciences'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
