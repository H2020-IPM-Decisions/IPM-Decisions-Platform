import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/shared/services/idp/admin/user.service';

@Component({
  selector: 'confirm-mail',
  templateUrl: './confirm-mail.component.html',
  styleUrls: ['./confirm-mail.component.css']
})
export class ConfirmMailComponent implements OnInit {

  text = "Wait";

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    var sub = this.route.queryParams.subscribe(
      (params) => {
        var { token, userId } = params;
        token = encodeURIComponent(token);
        this.userService.registerUser(token, userId)
          .toPromise()
          .then((x) => this.text = JSON.stringify(x))
          .catch((x) => this.text = JSON.stringify(x));
      },
      null,
      () => { sub.unsubscribe() }
    )
  }

}
