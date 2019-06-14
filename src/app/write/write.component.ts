import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Post } from "../core/models/post.model";
import { FormBuilder, Validators } from "@angular/forms";
import { PostService } from "../core/services/posts.service";
import { NotificationService } from "../core/services/notification.service";
import { FileUploadService } from "../core/services/file-upload.service";
import { AuthService } from "../core/services/auth.service";
import { ActivatedRoute, Params } from "@angular/router";
import { UtilService } from "../core/services/util.service";

@Component({
  selector: "app-write",
  templateUrl: "./write.component.html",
  styleUrls: ["./write.component.scss"]
})
export class WriteComponent implements OnInit, AfterViewInit {
  fragment: string;

  pix: File;
  pixURL: any;
  pixErr: string;

  post: Post = {
    title: null,
    text: null,
    tags: [],
    image: null,
    heartCount: 0
  };

  tags: string = "";
  hide = true;
  err: string = null;

  constructor(
    private fb: FormBuilder,
    private db: PostService,
    private route: ActivatedRoute,
    public util: UtilService,
    public auth: AuthService,
    private notif: NotificationService,
    private fus: FileUploadService
  ) {}

  postForm = this.fb.group({
    title: [
      "",
      Validators.compose([Validators.minLength(10), Validators.required])
    ],
    content: [
      "",
      Validators.compose([Validators.minLength(1250), Validators.required])
    ],
    coverImage: ["", Validators.required]
  });

  ngOnInit() {
    this.util.load();

    this.route.params.subscribe((qp: Params) => {
      if (qp.draft) {
        this.db.getDraftById(qp.draft).subscribe(d => {
          this.post.id = d.id;
          this.post.title = d.title;
          this.post.text = d.text;
          this.post.tags = d.tags;

          for (let idx = 0; idx < d.tags.length; idx++) {
            const tag = d.tags[idx];
            this.tags += `${idx === 0 ? "" : ", "}${tag}`;
          }

          this.post.image = d.image;
          this.pixURL = d.image;
        });
      }
    });

    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });

    this.util.loaded();
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

  setPix(event) {
    this.pix = (document.querySelector("#pix") as HTMLInputElement).files[0];

    const fr = new FileReader();

    fr.addEventListener("loadend", () => (this.pixURL = fr.result));
    fr.readAsDataURL(this.pix);

    console.log(this.pixURL);
  }

  getDate() {
    return new Date();
  }

  updateTags() {
    this.post.tags = this.tags.split(",");
    this.post.tags.forEach(t => t.toLowerCase().trim());
  }

  saveDraft() {
    // this.notif.success("Draft saved Successfully.");

    // if (this.pix) {
    this.fus.upload((photoURL?) => {
      this.post.text = this.postForm.get("content").value;
      this.post.image = photoURL ? photoURL : this.post.image;

      this.db
        .addDraft(this.post)
        .then(() => {
          this.notif.success("Draft saved Successfully.");
        })
        .catch(e => this.notif.logError(e));
    }, this.pix);
    // } else {
    // this.post.text = this.postForm.get('content').value;

    //     this.db.addDraft(this.post)
    //     .then(
    //       () => {
    //         this.notif.success('Draft saved Successfully.');
    //       })
    //     .catch(e => this.notif.logError(e));
    // }
  }

  postArticle() {
    // if (this.pix) {
    // } else {
    this.post.text = this.postForm.get("content").value;
    // this.post.image = photoURL;
    this.db
      .addPost(this.post)
      .then(() => {
        this.notif.success("Article Posted Successfully.");
        this.hide = true;
        this.postForm.reset();
        this.pix = this.pixURL = this.tags = null;
        this.post.tags = [];
      })
      .catch(e => this.notif.logError(e));
    // }
  }

  previewPost() {
    this.post.text = this.postForm.get("content").value;
    this.hide = false;
  }

  hideModal() {
    this.hide = true;
  }
}
