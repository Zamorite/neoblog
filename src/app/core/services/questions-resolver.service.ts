import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';
import { Answer } from '../models/answer.model';
import { DataService } from './data.service';

interface QuestionSet {
  questions:  Observable<Question[]>;
  answers: Observable<Answer[]>[];
}


/*
  This question resolver of a thing really needs a complete overhaul...
*/


@Injectable({
  providedIn: 'root'
})
export class QuestionsResolver implements Resolve<QuestionSet> {

  questionSet: QuestionSet = <QuestionSet>{};

  constructor(private dataService: DataService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QuestionSet> | Promise<QuestionSet> | QuestionSet {

    // this.questionSet.questions = this.dataService.Question$;

    this.questionSet.questions.subscribe(
      questions => {
        for (const question of questions) {
          // const answers = this.dataService.getAnswers(question.id);
          // this.questionSet.answers.push(answers);
          console.log(':) Im here');
          console.log('********************\n', question.author, question.text, '\n********************\n\n');
        }
      }
    );

    return this.questionSet;
  }
}
