import { Component, OnInit, AfterViewInit } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { Observable, of } from "rxjs";
import { Post } from "../../core/models/post.model";
import { UtilService } from "../../core/services/util.service";
import { PostService } from "../../core/services/posts.service";
import { ActivatedRoute } from "@angular/router";
import { User } from "../../core/models/user.model";
import { auth } from "firebase";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit, AfterViewInit {
  posts: Observable<Post[]>;
  user$: Observable<User>;

  constructor(
    public auth: AuthService,
    public util: UtilService,
    public db: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.util.load();

    const uid = this.route.snapshot.params.uid;

    if (uid) {
      this.user$ = this.db.getUser(uid);
      this.user$
        .pipe(
          switchMap<any, {}>(u => {
            this.posts = this.db.getPostsByAuthor(uid);

            return this.posts ? this.posts : of([]);
          })
        )
        .subscribe(p => this.util.loaded())
        .add(() => this.util.loaded());
    } else {
      this.user$ = this.auth.user;
      let uid;

      this.user$
        .pipe(
          switchMap<any, {}>(u => {
            // Unique User IDs
            uid = u.uid;

            this.posts = this.db.getPostsByAuthor(uid);

            return this.posts ? this.posts : of([]);
          })
        )
        .subscribe(p => this.util.loaded())
        .add(() => this.util.loaded());
    }
  }

  ngAfterViewInit(): void {
    try {
      document.querySelector("#header").scrollIntoView();
    } catch (e) {}
  }
}
