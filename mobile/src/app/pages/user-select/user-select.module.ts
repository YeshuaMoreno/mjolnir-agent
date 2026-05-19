import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSelectPageRoutingModule } from './user-select-routing.module';

import { UserSelectPage } from './user-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSelectPageRoutingModule
  ],
  declarations: [UserSelectPage]
})
export class UserSelectPageModule {}
