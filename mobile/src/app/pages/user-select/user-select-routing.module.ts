import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSelectPage } from './user-select.page';

const routes: Routes = [
  {
    path: '',
    component: UserSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSelectPageRoutingModule {}
