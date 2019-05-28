import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { UtilService } from '../../core/services/util.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  search = false;

  constructor(
    public auth: AuthService,
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  noSearch() {
    this.search = false;
  }

  showSearch() {
    this.search = true;
  }

}
