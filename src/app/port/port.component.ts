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
export class PortComponent implements OnInit {

  posts: Observable<Post[]>;

  constructor(
    public auth: AuthService,
    public util: UtilService,
    public db: PostService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.util.load();

    const uid = this.route.snapshot.params.author;
    this.posts = this.db.getPostsByAuthor(uid);

    this.posts.subscribe(
      p => this.util.loaded()
    ).add(
      () => this.util.loaded()
    );
  }

  // ngOnDestroy(): void {
  //   this.util.setBoards({
  //     header: true,
  //     footer: true,
  //   });
  // }

}
