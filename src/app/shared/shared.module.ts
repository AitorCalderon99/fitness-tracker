import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../material.module';
import {FormsModule} from "@angular/forms";

const sharedModules = [
  CommonModule,
  MaterialModule,
  FlexLayoutModule,
  FormsModule
]

@NgModule({
  imports: [
    sharedModules
  ],
  exports: [
    sharedModules
  ]
})
export class SharedModule {
}
