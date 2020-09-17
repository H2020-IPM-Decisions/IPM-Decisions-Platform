import { Component, OnInit } from '@angular/core';
import { MaprisksService } from '@app/maprisks/maprisks.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.component.html',
  styleUrls: ['./farm-details.component.css']
})
export class FarmDetailsComponent implements OnInit {
  elements: any = [];
  headElements = ['field', 'cropType', 'cropVariety', 'sowingate'];

  private map!: L.Map;
  // private map;


  constructor(private maprisksService: MaprisksService) { }

  // ngAfterViewInit(): void {
  // }

  ngOnInit() {
    for (let i = 1; i <= 7; i++) {
      this.elements.push({ field: i, cropType: 'Crop Type ' + i, cropVariety: 'Crop Variety ' + i, sowingate: 'Sowing Date ' + i });
    }


    // init map
    this.maprisksService.initialize('map').subscribe(data => {
      this.map = data;
      const featureGroup = this.maprisksService.createFeatureGroup(this.map);
      this.maprisksService.addMarker(47.4744951, 10.9576836, featureGroup);
    });
  }



  // private initMap(): void {
  //   this.map = L.map('map', {
  //     center: [39.8282, -98.5795],
  //     zoom: 3
  //   });

  //   const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  //   });

  //   tiles.addTo(this.map);
  // }

}
