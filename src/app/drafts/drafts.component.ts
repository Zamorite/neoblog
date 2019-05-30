import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from '../core/services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../core/services/util.service';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit, AfterViewInit {

  fragment: string;
  drafts: Observable<any>;

  constructor(
    private db: PostService,
    private route: ActivatedRoute,
    public util: UtilService
  ) {}

  ngOnInit() {
    this.util.load();

    this.drafts = this.db.getDrafts();

    this.drafts.subscribe(
      p => this.util.loaded()
    ).add(
      () => this.util.loaded()
    );  

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
        document.querySelector("#header").scrollIntoView();
      } catch (e) {}
    }
  }

}
