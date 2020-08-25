import { OnInit, Component } from '@angular/core';
import { CMSService } from '@app/shared/services/cms.service';

@Component({
  selector: 'app-user',
  template: './user.component.html'
})
export class UserComponent implements OnInit {
  homeSlideshow: any = {};
  constructor(private _cmsService: CMSService) { }
  ngOnInit(): void {
    this._cmsService.getHomeSlideshow().then(response => this.homeSlideshow = response);
  }

}