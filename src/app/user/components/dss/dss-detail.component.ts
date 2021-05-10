import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IDssFlat } from './dss-selection.model';
import dssFakeJson from './fake/dss-result.json';
@Component({
  selector: 'app-dss-detail',
  templateUrl: './dss-detail.component.html',
  styleUrls: ['./dss-detail.component.css']
})
export class DssDetailComponent implements OnInit {

  $subscription: Subscription;
  dssDetail: IDssFlat;
  
  constructor(private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    this.$subscription = this.activatedRoute.data.subscribe(({ dssDetail }) => {
      // this.dssDetail = dssDetail;
      this.dssDetail = dssFakeJson;
    });
  }

  goBack(): void {
    window.history.back();
  }
}
