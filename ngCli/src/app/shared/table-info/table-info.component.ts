import { Component, OnInit } from '@angular/core';
import {DataService} from '../../core/data-service/data-service.service'
@Component({
  selector: 'app-table-info',
  templateUrl: './table-info.component.html',
  styleUrls: ['./table-info.component.css']
})
export class TableInfoComponent implements OnInit {
  constructor(public dataService: DataService) { }
  private pdbContent;
  ngOnInit() {
    this.dataService.currentProtein.subscribe(pdbContent => this.pdbContent = pdbContent);
  }
}
