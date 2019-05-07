import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private notif: NotificationService
  ) { }

  usr: User;

  err: string = null;


  emailRegExp = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;

  profile = this.fb.group(
    {
      displayName: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern(this.emailRegExp), Validators.required])],
      field: ['', Validators.required],
      school: ['', Validators.required]
    }
  );


  ngOnInit() {

    this.auth.user.subscribe(
      u => {
        this.usr = u;
      }
    );
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
