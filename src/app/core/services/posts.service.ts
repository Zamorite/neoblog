import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, combineLatest, of, defer } from 'rxjs';
import { map, defaultIfEmpty, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase';
import { NotificationService } from './notification.service';
import { FileUploadService } from './file-upload.service';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  loading = false;
  uid: string;
  liked: string[];

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private notif: NotificationService,
    private notify: NotificationService,
    private file: FileUploadService
    ) {
      this.auth.user.subscribe(
        usr => {
          if (usr) {
            this.uid = usr.uid;
            this.liked = usr.liked;
          }
        }
      );
    }

    getTop(): Observable<Post[]> {
      // don't forget to add index for the query beneath... 👍 DONE!
      const PCol$ = this.afs.collection<Post>('posts', ref => {
        // don't forget to change '<' to '>'
        return ref.where('heartCount', '<=', 1).limit(10).orderBy('heartCount', 'desc').orderBy('createdAt', 'desc');
      });
      return PCol$.valueChanges();
    }

    getLatest(): Observable<Post[]> {
      // don't forget to add index for the query beneath... 👍 DONE!
      const PCol$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('heartCount', '<=', 3).limit(10).orderBy('heartCount', 'desc').orderBy('createdAt', 'desc');
      });
      return PCol$.valueChanges();
    }

    getTopPostsByTag(tag: string): Observable<Post[]> {
      const PCol$ = this.afs.collection<Post>('posts', ref => {
        // Dont't forget to uncomment this and comment the right one...
        return ref.where('tags', 'array-contains', tag).where('heartCount', '<=', 1).limit(10).orderBy('heartCount', 'desc').orderBy('createdAt', 'desc');
        // return ref.where('tags', 'array-contains', tag).where('heartCount', '>=', 1).limit(10).orderBy('createdAt', 'desc');
      });
      return PCol$.valueChanges();
    }

    getLatestPostsByTag(tag: string): Observable<Post[]> {
      const PCol$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('tags', 'array-contains', tag).where('heartCount', '<=', 3).limit(10).orderBy('createdAt', 'desc');
      });
      return PCol$.valueChanges();
    }

    getTopPostsByField(field: string): Observable<Post[]> {
      const PCol$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('field', '==', field).where('heartCount', '>=', 1).limit(10).orderBy('createdAt', 'desc');
      });
      return PCol$.valueChanges();
    }

    getPostById(id: string): Observable<Post> {
      const post$ = this.afs.doc<Post>(`posts/${id}`);
      return post$.valueChanges();
    }

    getLatestPostsByField(field: string): Observable<Post[]> {
      const PCol$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('field', '==', field).where('heartCount', '<=', 3).limit(10).orderBy('createdAt', 'desc');
      });
      return PCol$.valueChanges();
    }

    getPostsByAuthor(author: string): Observable<Post[]> {
      const PCol$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('author', '==', author).limit(20).orderBy('createdAt', 'desc');
      });
      return PCol$.valueChanges();
    }

    getComments(pid: string): Observable<Comment[]> {
      const CommentCollection$ = this.afs.collection<Comment>('comments', ref => {
        return ref.where('pid', '==', pid);
      });
      return CommentCollection$.valueChanges();
    }


    // Firestore Joins

    joinUsers(post$: Observable<any>) {
      return defer(
        () => {
          let post;
          const joinKeys = {};

          return post$.pipe(
            switchMap(p => {
              // Unique User IDs
              post = p;
              const uids = Array.from(new Set(p.map(v => v.author)));

              // Firestore User Doc Reads
              const userDocs = uids.map(u =>
                this.afs.doc(`users/${u}`).valueChanges()
              );

              return userDocs.length ? combineLatest(userDocs) : of([]);
            }),
            map(arr => {
              arr.forEach(v => (joinKeys[(v as any).uid] = v));

              post = post.map(v => {
                return { ...v, author: joinKeys[v.author] };
              });

              return post;
            }),
            defaultIfEmpty(false)
          );
        }
      );
    }

    joinComments(post$: Observable<any>) {
      return defer(
        () => {
          let post;

          return post$.pipe(
            switchMap<any, {}>(p => {
              // Unique User IDs
              post = p;

              const commentsDocs = this.joinUsers(this.getComments(p.id));

              return commentsDocs ? of(commentsDocs) : of([]);
            }),
            map(v => {

              post = {...post, comments: v };
              return post;
            }),
            defaultIfEmpty(false)
          );
        }
      );
    }

    joinAuthor(post$: Observable<any>) {

      return defer(
        () => {
          let post;
          const joinKeys = {};

          return post$.pipe(
            switchMap(p => {
              // Unique User IDs
              post = p;

              const uid = p.author;

              // Firestore User Doc Reads
              const userDoc = this.afs.doc(`users/${uid}`).valueChanges();

              return userDoc ? userDoc : of(null);
            }),
            map(doc$ => {
              joinKeys[(doc$ as any).uid] = doc$;
              post = { ...post, author: joinKeys[post.author] };

              return post;
            })
          );
        }
      );
    }




  /*
    CRUD for Posts and Answers....
  */

  addPost(post: Post) {
    post.id = this.afs.createId();
    post.createdAt = new Date();
    post.author = this.uid;

    const PCol$ = this.afs.collection(`posts`);

    return PCol$.doc(post.id).set(post).then(
      () => {

        // increase the number of posts on the user's document
        const user = this.afs.doc(`users/${this.uid}`);

        user.get().subscribe(
          userDoc => {
            user.update({asked: userDoc.data().posted + 1});
          }
        );


        return Promise.resolve(true);
      }
    ).catch(
      err => {
        this.notify.logError(err);
        return Promise.resolve(true);
      }
    );
  }

  addComment(pid: string, comment: Comment) {
    comment.author = this.uid;
    comment.id = this.afs.createId();
    comment.createdAt = new Date();

    const PCol$ = this.afs.collection(`posts`);

    this.afs.collection<Comment>('comments').doc(comment.id).set(comment).then(
      () => {

        PCol$.doc(pid).update({comments: firestore.FieldValue.arrayUnion(comment.id)});
        // PCol$.doc(pid).update({commenters: firestore.FieldValue.arrayUnion(this.uid)});

        // increase the number of comments on the user's document
        const user$ = this.afs.doc(`users/${this.uid}`);

        // user$.get().subscribe(
        //   userDoc => {
        //     user$.update({commented: userDoc.data().commented + 1});
        //   }
        // );

        this.notif.notifyAuthor(pid);

        return Promise.resolve(true);
      }
    ).catch(
      err => {
        this.notify.logError(err);
        return Promise.resolve(true);
      }
    );
  }

  getPosts(): Observable<Post[]> {
    const postCollection$ = this.afs.collection<Post>('posts', ref => {
      return ref.where('uid', '==', this.uid);
    });
    const post$ = postCollection$.valueChanges();
    return post$;
  }

  // getCommentedPosts(): Observable<Post[]> {
  //   const postCollection$ = this.afs.collection<Post>('posts', ref => {
  //     return ref.where('commentators', 'array-contains', this.uid);
  //   });
  //   const post$ = postCollection$.valueChanges();
  //   return post$;
  // }


  /*
    Updating Like Counts for posts and Answers
  */


  toggleHeart(id: string) {
    const posts$ = this.afs.collection(`posts`);

    if (this.uid) {

      if (this.liked && this.liked.includes(id)) {

        posts$.doc(id).update({heartCount: firestore.FieldValue.increment(-1)})
        .then(
          () => this.afs.doc(`users/${this.uid}`).update({liked: firestore.FieldValue.arrayRemove(id)})
          .then(
              () => this.notif.success('Post unliked!')
            )
          );
        } else {
          
          posts$.doc(id).update({heartCount: firestore.FieldValue.increment(1)})
          .then(
            () => this.afs.doc(`users/${this.uid}`).update({liked: firestore.FieldValue.arrayUnion(id)})
            .then(
              () => this.notif.success('Post liked!')
            )
          );
      }
    } else {
      this.notif.logError('Oops!', 'You need to be signed in to like posts');
    }
  }
}
