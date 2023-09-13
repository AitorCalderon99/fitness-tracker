import {NgModule} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

const angularMatModules = [
  MatButtonModule,
  MatIconModule
];

@NgModule({
  imports: [
    angularMatModules
  ],
  exports: [
    angularMatModules
  ]
})
export class MaterialModule {

}
