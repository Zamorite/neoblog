import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notif: NotificationService
  ) { }

  fragment: string;

  usr: User;

  err: string = null;


  emailRegExp = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;

  profile = this.fb.group(
    {
      displayName: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern(this.emailRegExp), Validators.required])],
      field: ['', Validators.required],
      about: ['', Validators.compose([Validators.required, Validators.minLength(20)])],
      school: ['', Validators.required]
    }
  );


  ngOnInit() {

    this.auth.user.subscribe(
      u => {
        this.usr = u;
      }
    );

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
        document.querySelector("#header").scrollIntoView();
      } catch (e) {}
    }
  }



  async submit() {
    this.err = null;
    console.log(this.usr);

    await this.auth.updateUser(this.usr)
    .then(
      () => {
        this.router.navigate(['/']);
      }
    ).catch(
      e => {
        this.err = e;
        this.notif.logError(e);
      }
    );
  }

}
