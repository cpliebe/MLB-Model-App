import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchupsComponent } from './matchups/matchups.component';
import { HomeComponent } from './home/home.component';
import { PicksComponent } from './picks/picks.component';

const routes: Routes = [
  { path: 'matchups', component: MatchupsComponent},
  {path: '', component: HomeComponent},
  {path: 'my-picks', component: PicksComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
