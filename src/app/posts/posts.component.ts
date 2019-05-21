import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from '../core/services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../core/services/util.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts: Observable<any>;
  tag: string;

  constructor(
    private db: PostService,
    private route: ActivatedRoute,
    public util: UtilService
  ) { }

  ngOnInit() {
    this.util.load();

    const tag = this.route.snapshot.params.tag;
    
    if (tag) {

      const rawPosts = this.db.getTopPostsByTag(tag);
      this.posts = this.db.joinUsers(rawPosts);
      this.tag = tag;

      this.posts.subscribe(
        p => this.util.loaded()
      ).add(
        () => this.util.loaded()
      );

    } else {
      const rawPosts = this.db.getTop();
      this.posts = this.db.joinUsers(rawPosts);

      this.posts.subscribe(
        p => this.util.loaded()
      ).add(
        () => this.util.loaded()
      );  
    }
  }

}
