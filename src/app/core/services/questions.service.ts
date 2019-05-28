import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, combineLatest, of, defer } from 'rxjs';
import { switchMap, map, first, defaultIfEmpty } from 'rxjs/operators';
import { firestore } from 'firebase';
import { NotificationService } from './notification.service';
import { FileUploadService } from './file-upload.service';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  loading = false;
  uid: string;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private notif: NotificationService,
    private notify: NotificationService,
    private file: FileUploadService
    ) {
      auth.user.subscribe(
        usr => {
          if (usr) {
            this.uid = usr.uid;
          }
        }
      );
    }

    getTop(): Observable<Question[]> {
      // don't forget to add index for the query beneath... 👍 DONE!
      const q_col$ = this.afs.collection<Question>('questions', ref => {
        return ref.where('heartCount', '>=', 1).limit(10).orderBy('heartCount', 'desc').orderBy('date', 'desc');
      });
      return q_col$.valueChanges();
    }

    getLatest(): Observable<Question[]> {
      // don't forget to add index for the query beneath... 👍 DONE!
      const q_col$ = this.afs.collection<Question>('questions', ref => {
        return ref.where('heartCount', '<=', 3).limit(10).orderBy('heartCount', 'desc').orderBy('date', 'desc');
      });
      return q_col$.valueChanges();
    }

    getTopQuestionsByTag(tag: string): Observable<Question[]> {
      const q_col$ = this.afs.collection<Question>('questions', ref => {
        return ref.where('tags', 'array-contains', tag).where('heartCount', '>=', 1).limit(10).orderBy('date', 'desc');
      });
      return q_col$.valueChanges();
    }

    getLatestQuestionsByTag(tag: string): Observable<Question[]> {
      const q_col$ = this.afs.collection<Question>('questions', ref => {
        return ref.where('tags', 'array-contains', tag).where('heartCount', '<=', 3).limit(10).orderBy('date', 'desc');
      });
      return q_col$.valueChanges();
    }

    getTopQuestionsByExam(exam: string): Observable<Question[]> {
      const q_col$ = this.afs.collection<Question>('questions', ref => {
        return ref.where('exam', '==', exam).where('heartCount', '>=', 1).limit(10).orderBy('date', 'desc');
      });
      return q_col$.valueChanges();
    }

    getQuestionById(id: string): Observable<Question> {
      const question$ = this.afs.doc<Question>(`questions/${id}`);
      return question$.valueChanges();
    }

    getLatestQuestionsByExam(exam: string): Observable<Question[]> {
      const q_col$ = this.afs.collection<Question>('questions', ref => {
        return ref.where('exam', '==', exam).where('heartCount', '<=', 3).limit(10).orderBy('date', 'desc');
      });
      return q_col$.valueChanges();
    }

    getAnswers(qid: string): Observable<Answer[]> {
      const AnswerCollection$ = this.afs.collection<Answer>('answers', ref => {
        return ref.where('qid', '==', qid);
      });
      return <Observable<Answer[]>> AnswerCollection$.valueChanges();
    }


    // Firestore Joins

    joinUsers(question$: Observable<any>) {
      return defer(
        () => {
          let question;
          const joinKeys = {};

          return question$.pipe(
            switchMap(q => {
              // Unique User IDs
              question = q;
              const uids = Array.from(new Set(q.map(v => v.author)));

              // Firestore User Doc Reads
              const userDocs = uids.map(u =>
                this.afs.doc(`users/${u}`).valueChanges()
              );

              return userDocs.length ? combineLatest(userDocs) : of([]);
            }),
            map(arr => {
              arr.forEach(v => (joinKeys[(<any>v).uid] = v));
              question = question.map(v => {
                return { ...v, author: joinKeys[v.author] };
              });

              return question;
            }),
            defaultIfEmpty(false)
          );
        }
      );
    }

    joinAnswers(question$: Observable<any>) {
      return defer(
        () => {
          let questions;
          const joinKeys = {};

          return question$.pipe(
            switchMap(q => {
              // Unique User IDs
              questions = q;

              const answersDocs = q.map(
                question => this.joinUsers(this.getAnswers(question.id))
              );


              return answersDocs.length ? combineLatest(answersDocs) : of([]);
            }),
            map(arr => {
              arr.forEach(v => {

                v.map(
                  vee => (joinKeys[(<any>vee).qid] = v)
                );
              });

              questions = questions.map(v => {
                return { ...v, answers: joinKeys[v.id] };
              });

              return questions;
            }),
            defaultIfEmpty(false)
          );
        }
      );
    }

    joinAuthor(question$: Observable<any>) {

      return defer(
        () => {
          let question;
          const joinKeys = {};

          return question$.pipe(
            switchMap(q => {
              // Unique User IDs
              question = q;

              const uid = q.author;

              // Firestore User Doc Reads
              const userDoc = this.afs.doc(`users/${uid}`).valueChanges();

              return userDoc ? userDoc : of(null);
            }),
            map(doc$ => {
              joinKeys[(<any>doc$).uid] = doc$;
              question = { ...question, author: joinKeys[question.author] };

              return question;
            })
          );
        }
      );
    }

    // joinAnswersToQuestion(question$: Observable<any>) {
    //   return defer(
    //     () => {
    //       let questions;

    //       return question$.pipe(
    //         switchMap(q => {
    //           // Unique User IDs
    //           questions = q;

    //           const answersDocs = this.joinUsers(this.getAnswers(q.id));

    //           return answersDocs ? of(answersDocs) : of([]);
    //         }),
    //         map(v => {

    //           questions = {...questions, answers: v };
    //           return questions;
    //         })
    //       );
    //     }
    //   );
    // }




  /*
    CRUD for Questions and Answers....
  */

  addQuestion(question: Question) {
    question.id = this.afs.createId();
    question.date = new Date;

    const q_col$ = this.afs.collection(`questions`);

    return q_col$.doc(question.id).set(question).then(
      async () => {

        const photoURL = this.file.getPhotoURL();
        this.file.resetPhotoURL();

        if (photoURL) {
          q_col$.doc(question.id).update({image: photoURL});
        }

        // increase the number of questions on the user's document
        const user = this.afs.doc(`users/${this.uid}`);

        user.get().subscribe(
          userDoc => {
            user.update({asked: userDoc.data().asked + 1});
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

  addAnswer(qid: string, answer: Answer) {
    answer.author = this.uid;
    answer.id = this.afs.createId();
    const q_col$ = this.afs.collection(`questions`);

    this.afs.collection<Answer>('answers').doc(answer.id).set(answer).then(
      () => {

        const photoURL = this.file.getPhotoURL();
        this.file.resetPhotoURL();

        if (photoURL) {
          this.afs.collection<Answer>('answers').doc(answer.id).update({image: photoURL});
        }

        q_col$.doc(qid).update({answers: firestore.FieldValue.arrayUnion(answer.id)});
        q_col$.doc(qid).update({answerers: firestore.FieldValue.arrayUnion(this.uid)});

        // increase the number of answers on the user's document
        const user$ = this.afs.doc(`users/${this.uid}`);

        user$.get().subscribe(
          userDoc => {
            user$.update({answered: userDoc.data().answered + 1});
          }
        );

        this.notif.notifyAuthor(qid);
      }
    ).catch(
      // Error Handler goes here...
    );
  }

  getQuestions(): Observable<Question[]> {
    const QuestionCollection$ = this.afs.collection<Question>('questions', ref => {
      return ref.where('uid', '==', this.uid);
    });
    const question$ = <Observable<Question[]>> QuestionCollection$.valueChanges();
    return question$;
  }

  getAnsweredQuestions(): Observable<Question[]> {
    const QuestionCollection$ = this.afs.collection<Question>('questions', ref => {
      return ref.where('answerers', 'array-contains', this.uid);
    });
    const question$ = <Observable<Question[]>> QuestionCollection$.valueChanges();
    return question$;
  }


  /*
    Updating Like Counts for Questions and Answers
  */

  toggleLike(question: boolean, id: string) {
    const like = { liker: null, createdAt: null };

    like.liker = this.uid;
    like.createdAt = new Date;

    let l_col$: AngularFirestoreCollection;

    if (question) {
      l_col$ = this.afs.collection(`questions`);
    } else {
      l_col$ = this.afs.collection(`answers`);
    }

    l_col$.doc(id).collection('hearts').add(like); // .then(
      // () => {
      //   // increase the number of questions on the user's document
      //   const user = this.afs.doc(`users/${this.uid}`);

      //   user.get().subscribe(
      //     userDoc => {
      //       user.update({asked: userDoc.data().asked + 1});
      //     }
      //   );
      // }
      // ).catch(
      //   // Error Handler goes here...
      // );
  }
}
