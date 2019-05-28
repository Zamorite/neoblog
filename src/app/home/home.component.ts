import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  fragment: string;

  categories = [
    {
      link: "math.jpg",
      name: "mathematics",
      field: "sciences"
    },
    {
      link: "eng.jpg",
      name: "english language",
      field: "arts"
    },
    {
      link: "phx.jpg",
      name: "physics",
      field: "sciences"
    },
    {
      link: "com.jpg",
      name: "commerce",
      field: "commercials"
    },
    {
      link: "chem.png",
      name: "chemistry",
      field: "sciences"
    },
    {
      link: "lit.png",
      name: "literature",
      field: "arts"
    },
    {
      link: "bio.jpg",
      name: "biology",
      field: "sciences"
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

  ngAfterViewInit(): void {
    if (this.fragment) {
      try {
        document.querySelector("#" + this.fragment).scrollIntoView();
      } catch (e) {}
    } else {
      try {
        document.querySelector("#home").scrollIntoView();
      } catch (e) {}
    }
  }
}
