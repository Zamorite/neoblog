import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { UtilService } from '../core/services/util.service';
import { AuthService } from '../core/services/auth.service';
import { Post } from '../core/models/post.model';
import { PostService } from '../core/services/posts.service';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss']
})
export class PortComponent implements OnInit, OnDestroy {

  posts: Observable<Post[]>;

  constructor(
    public auth: AuthService,
    private util: UtilService,
    public db: PostService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.util.setBoards({
      header: true,
      footer: false,
    });

    const uid = this.route.snapshot.params.author;
    this.posts = this.db.getPostsByAuthor(uid)
  }

  ngOnDestroy(): void {
    this.util.setBoards({
      header: true,
      footer: true,
    });
  }

}
