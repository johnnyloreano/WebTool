import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from './label/label.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
   declarations: [
     LabelComponent     
   ],
  exports: [
    LabelComponent
  ],
   entryComponents: [
    LabelComponent
  ]
})
export class SharedModule { }
