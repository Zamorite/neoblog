import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public util: UtilService
  ) { }

  ngOnInit() {
  }

}
