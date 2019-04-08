import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, combineLatest, of, defer } from 'rxjs';
import { switchMap, map, defaultIfEmpty } from 'rxjs/operators';
import { firestore } from 'firebase';
import { NotificationService } from './notification.service';
import { FileUploadService } from './file-upload.service';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';


@Injectable({
  providedIn: 'root'
})
export class postService {
  loading = false;
  uid: string;

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
          }
        }
      );
    }

    getTop(): Observable<Post[]> {
      // don't forget to add index for the query beneath... 👍 DONE!
      const p_col$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('heartCount', '>=', 1).limit(10).orderBy('heartCount', 'desc').orderBy('createdAt', 'desc');
      });
      return p_col$.valueChanges();
    }

    getLatest(): Observable<Post[]> {
      // don't forget to add index for the query beneath... 👍 DONE!
      const p_col$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('heartCount', '<=', 3).limit(10).orderBy('heartCount', 'desc').orderBy('createdAt', 'desc');
      });
      return p_col$.valueChanges();
    }

    getTopPostsByTag(tag: string): Observable<Post[]> {
      const p_col$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('tags', 'array-contains', tag).where('heartCount', '>=', 1).limit(10).orderBy('createdAt', 'desc');
      });
      return p_col$.valueChanges();
    }

    getLatestPostsByTag(tag: string): Observable<Post[]> {
      const p_col$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('tags', 'array-contains', tag).where('heartCount', '<=', 3).limit(10).orderBy('createdAt', 'desc');
      });
      return p_col$.valueChanges();
    }

    getTopPostsByField(field: string): Observable<Post[]> {
      const p_col$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('field', '==', field).where('heartCount', '>=', 1).limit(10).orderBy('createdAt', 'desc');
      });
      return p_col$.valueChanges();
    }

    getPostById(id: string): Observable<Post> {
      const post$ = this.afs.doc<Post>(`posts/${id}`);
      return post$.valueChanges();
    }

    getLatestPostsByField(field: string): Observable<Post[]> {
      const p_col$ = this.afs.collection<Post>('posts', ref => {
        return ref.where('field', '==', field).where('heartCount', '<=', 3).limit(10).orderBy('createdAt', 'desc');
      });
      return p_col$.valueChanges();
    }

    getComments(pid: string): Observable<Comment[]> {
      const CommentCollection$ = this.afs.collection<Comment>('comments', ref => {
        return ref.where('pid', '==', pid);
      });
      return <Observable<Comment[]>> CommentCollection$.valueChanges();
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
              arr.forEach(v => (joinKeys[(<any>v).uid] = v));
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
          let posts;
          const joinKeys = {};

          return post$.pipe(
            switchMap(p => {
              // Unique User IDs
              posts = p;

              const commentsDocs = p.map(
                post => this.joinUsers(this.getComments(post.id))
              );


              return commentsDocs.length ? combineLatest(commentsDocs) : of([]);
            }),
            map(arr => {
              arr.forEach(v => {

                v.map(
                  vee => (joinKeys[(<any>vee).pid] = v)
                );
              });

              posts = posts.map(v => {
                return { ...v, comments: joinKeys[v.id] };
              });

              return posts;
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
              joinKeys[(<any>doc$).uid] = doc$;
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
    post.createdAt = new Date;

    const p_col$ = this.afs.collection(`posts`);

    return p_col$.doc(post.id).set(post).then(
      async () => {

        const photoURL = this.file.getPhotoURL();
        this.file.resetPhotoURL();

        if (photoURL) {
          p_col$.doc(post.id).update({image: photoURL});
        }

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
    const p_col$ = this.afs.collection(`posts`);

    this.afs.collection<Comment>('comments').doc(comment.id).set(comment).then(
      () => {

        const photoURL = this.file.getPhotoURL();
        this.file.resetPhotoURL();

        if (photoURL) {
          this.afs.collection<Comment>('comments').doc(comment.id).update({image: photoURL});
        }

        p_col$.doc(pid).update({comments: firestore.FieldValue.arrayUnion(comment.id)});
        p_col$.doc(pid).update({commenters: firestore.FieldValue.arrayUnion(this.uid)});

        // increase the number of comments on the user's document
        const user$ = this.afs.doc(`users/${this.uid}`);

        user$.get().subscribe(
          userDoc => {
            user$.update({commented: userDoc.data().commented + 1});
          }
        );

        this.notif.notifyAuthor(pid);
      }
    ).catch(
      // Error Handler goes here...
    );
  }

  getPosts(): Observable<Post[]> {
    const postCollection$ = this.afs.collection<Post>('posts', ref => {
      return ref.where('uid', '==', this.uid);
    });
    const post$ = <Observable<Post[]>> postCollection$.valueChanges();
    return post$;
  }

  getCommentedPosts(): Observable<Post[]> {
    const postCollection$ = this.afs.collection<Post>('posts', ref => {
      return ref.where('commentators', 'array-contains', this.uid);
    });
    const post$ = <Observable<Post[]>> postCollection$.valueChanges();
    return post$;
  }


  /*
    Updating Like Counts for posts and Answers
  */

  toggleLike(post: boolean, id: string) {
    const like = { liker: null, createdAt: null };

    like.liker = this.uid;
    like.createdAt = new Date;

    let l_col$: AngularFirestoreCollection;

    if (post) {
      l_col$ = this.afs.collection(`posts`);
    } else {
      l_col$ = this.afs.collection(`comments`);
    }

    l_col$.doc(id).collection('hearts').add(like);
  }
}
