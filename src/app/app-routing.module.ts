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

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'dashboard', canActivate: [AuthGuard]r, children:
  [
    {path: '', component: ProfileComponent},
    {path: 'edit', component: EditComponent},
  ]
  },
  {path: 'posts', component: PostsComponent},
  {path: 'post/:pid', component: PostComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
