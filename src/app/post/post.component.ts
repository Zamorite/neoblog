import { Component, OnInit } from '@angular/core';
import { Post } from '../core/models/post.model';
import { AuthService } from '../core/services/auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../core/services/util.service';
import { PostService } from '../core/services/posts.service';
import { Comment } from '../core/models/comment.model';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  pid: string;
  post$: Observable<any>;

  replying: {cid: string, who: string};

  comment: Comment = {
    content: null,
    heartCount: 0
  };


  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private db: PostService,
    public util: UtilService,
    private seo_title: Title,
    private seo_meta: Meta
  ) {}

  ngOnInit() {
    this.pid = this.route.snapshot.params.id;
    const rawPost$ = this.db.getPostById(this.pid);
    const withAuthor$ = this.db.joinAuthor(rawPost$);
    // this.post$ = withAuthor$;
    this.post$ = this.db.joinComments(withAuthor$);

    this.post$.subscribe(
      post => {
        this.seo_title.setTitle('');
        this.seo_meta.addTags([
          {name: 'twitter:card', content: 'summary'},
          {name: 'og:url', content: `/post/${post.id}`},
          {name: 'og:title', content: post.title},
          {name: 'og:description', content: 'Check out this wonderful post on NeoBlog!'},
          {name: 'og:image', content: post.image},
        ]);
      }
    );
  }


  submitComment() {
    this.comment.pid = this.pid;

    if (this.replying) {
      this.comment.rid = this.replying.cid;
      this.comment.ra = this.replying.who;
    }

    this.db.addComment(this.pid, this.comment);
    this.comment.content = '';

    this.replying = null;
  }

  reply(cid: string, who: string) {
    this.replying = {
      cid: cid,
      who: who
    };
  }

  like(qid: string) {
    this.db.toggleHeart(qid);
  }

}
