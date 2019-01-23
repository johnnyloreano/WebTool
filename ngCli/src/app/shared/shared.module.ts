import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from './label/label.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { LabelAtomComponent } from './label-atom/label-atom.component';
import { LabelResidueComponent } from './label-residue/label-residue.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
   declarations: [
     LabelComponent,
     LabelAtomComponent,
     LabelResidueComponent
   ],
  exports: [
    LabelComponent
  ],
   entryComponents: [
    LabelComponent
  ]
})
export class SharedModule { }
