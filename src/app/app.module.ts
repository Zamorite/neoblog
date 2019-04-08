import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';
import { AuthComponent } from './user/auth/auth.component';
import { DashComponent } from './user/dash/dash.component';
import { LoadingComponent } from './util/loading/loading.component';
import { NotifComponent } from './util/notif/notif.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

import { ScrollToDirective } from './core/directives/scroll-to.directive';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
// import { config } from 'process';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { config } from './fire.config';
import { FireDatePipe } from './core/pipes/fire-date.pipe';
import { MomentPipe } from './core/pipes/moment.pipe';
import { AvatarPipe } from './core/pipes/avatar.pipe';

import { WriteComponent } from './write/write.component';
import { ProfileComponent } from './dash/profile/profile.component';
import { EditComponent } from './dash/edit/edit.component';
import { NotFoundComponent } from './except/not-found/not-found.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostsComponent,
    PostComponent,
    AuthComponent,
    DashComponent,
    LoadingComponent,
    NotifComponent,
    HeaderComponent,
    FooterComponent,
    ScrollToDirective,
    FireDatePipe,
    MomentPipe,
    AvatarPipe,
    WriteComponent,
    ProfileComponent,
    EditComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
