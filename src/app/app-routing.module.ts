import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashComponent } from './user/dash/dash.component';
import { PostComponent } from './post/post.component';
import { PostsComponent } from './posts/posts.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthComponent } from './user/auth/auth.component';
import { ProfileComponent } from './dash/profile/profile.component';
import { EditComponent } from './dash/edit/edit.component';
import { NotFoundComponent } from './except/not-found/not-found.component';
import { WriteComponent } from './write/write.component';
import { PortComponent } from './port/port.component';
import { DraftsComponent } from './drafts/drafts.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'write', component: WriteComponent},
  {path: 'write/:draft', component: WriteComponent},
  {path: 'profile', canActivate: [AuthGuard], children:
  [
    {path: '', component: ProfileComponent},
    {path: ':uid', component: ProfileComponent},
    {path: 'edit', component: EditComponent},
  ]
  },
  {path: 'posts', component: PostsComponent},
  {path: 'drafts', component: DraftsComponent},
  {path: 'port/:author', component: PortComponent},
  {path: 'post/:id', component: PostComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
