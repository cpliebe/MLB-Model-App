import { Component } from '@angular/core';
import { PickService } from '../pick.service';
import { Pick } from '../pick-interface';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  styleUrls: ['./picks.component.css']
})
export class PicksComponent {

  constructor(private pickService: PickService) {

  }

  pickList: Pick[] = [];

  getPicks() {
  this.pickList = this.pickService.getPicks()
  }



}
