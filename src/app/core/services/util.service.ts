import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public header = true;
  public footer = true;

  constructor(
  private sanitizer: DomSanitizer
) {}

  randId() {
    const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return randLetter + Date.now();
  }

  setBoards(config) {
    this.header = config.header;
    this.footer = config.footer;
  }

  sanitize(url) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

}
