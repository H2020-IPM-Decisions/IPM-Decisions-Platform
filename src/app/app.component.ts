import { WeatherService } from './shared/services/wx/weather.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './core/auth/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'IPM-Decisions-Platform';

  constructor(private authenticationService:AuthenticationService,
    private weather: WeatherService){}
  ngOnInit(): void {
    this.authenticationService.autoLogin();

    this.weather.getWeatherData().subscribe(res => {
      // console.log("resul", res);
    })
  }
}
