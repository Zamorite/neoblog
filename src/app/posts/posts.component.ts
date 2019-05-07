import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from '../core/services/posts.service';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const tag = this.route.snapshot.params.tag;
    if (tag) {
      console.log(tag);
      
      const rawPosts = this.db.getTopPostsByTag(tag);
      this.posts = this.db.joinUsers(rawPosts);
      this.tag = tag;
    } else {
      const rawPosts = this.db.getTop();
      this.posts = this.db.joinUsers(rawPosts);
    }
  }

}
