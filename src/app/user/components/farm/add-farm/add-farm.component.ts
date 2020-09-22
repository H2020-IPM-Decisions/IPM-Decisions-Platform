import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-add-farm',
  templateUrl: './add-farm.component.html',
  styleUrls: ['./add-farm.component.css']
})
export class AddFarmComponent implements OnInit {

  private map: L.Map;
  @ViewChild('map', { static: false }) private mapContainer: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const initialState = {
      lng: 0,
      lat: 0,
      zoom: 9
    };
    const map = new L.Map(this.mapContainer.nativeElement).setView(
      [initialState.lat, initialState.lng],
      initialState.zoom
    );

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(map);

    // one marker
    L.marker([51.5, -0.09]).addTo(map).bindPopup("Farm name").openPopup();

    // many markers
    // this.locations.forEach((location) => {
    //   L.marker([location[1], location[2]]).addTo(map).bindPopup(location[0]).openPopup();
    // });
  }

}
