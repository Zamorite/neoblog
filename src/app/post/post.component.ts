import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { Post } from "../core/models/post.model";
import { AuthService } from "../core/services/auth.service";
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute, Params } from "@angular/router";
import { UtilService } from "../core/services/util.service";
import { PostService } from "../core/services/posts.service";
import { Comment } from "../core/models/comment.model";
import { Title, Meta } from "@angular/platform-browser";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit, AfterViewInit, OnDestroy {
  fragment: string;

  routeSub: Subscription;

  pid: string;
  post$: Observable<any>;

  replying: { cid: string; who: string };

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
    this.util.load();

    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.pid = params.id;
      const rawPost$ = this.db.getPostById(this.pid);
      const withAuthor$ = this.db.joinAuthor(rawPost$);
      // this.post$ = withAuthor$;
      this.post$ = this.db.joinComments(withAuthor$);

      this.post$
        .subscribe(post => {
          this.seo_title.setTitle(`${post.title} - BlgPrss`);
          this.seo_meta.updateTag({ name: "twitter:card", content: "summary" });
          this.seo_meta.updateTag({
            name: "og:url",
            content: `https://blgprss.com/post/${post.id}`
          });
          this.seo_meta.updateTag({ name: "og:title", content: post.title });
          this.seo_meta.updateTag({
            name: "og:description",
            content: `Check out this wonderful post by ${post.author.displayName} on BlgPrss!`
          });
          this.seo_meta.updateTag({ name: "og:image", content: post.image });
          this.seo_meta.updateTag({
            name: "twitter:url",
            content: `https://blgprss.com/post/${post.id}`
          });
          this.seo_meta.updateTag({ name: "twitter:title", content: post.title });
          this.seo_meta.updateTag({
            name: "twitter:description",
            content: `Check out this wonderful post by ${post.author.displayName} on BlgPrss!`
          });
          this.seo_meta.updateTag({ name: "twitter:image", content: post.image });
          this.seo_meta.updateTag({ name: "twitter:image:src", content: post.image });
          // this.seo_meta.addTags([
          //   ,
          //   ,

          // ]);

          this.util.loaded();
        })
        .add(() => this.util.loaded());
    });

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
        document.querySelector("#main").scrollIntoView();
      } catch (e) {}
    }
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  submitComment() {
    this.comment.pid = this.pid;

    if (this.replying) {
      this.comment.rid = this.replying.cid;
      this.comment.ra = this.replying.who;
    }

    this.db.addComment(this.pid, this.comment);
    this.comment.content = "";

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
