import { Injectable } from "@angular/core";
import * as L from "leaflet";
import * as esriGeo from "esri-leaflet-geocoder";
import { Location } from "@app/shared/models/location.model";
import { Router } from "@angular/router";
import { ReplaySubject, Observable, of, BehaviorSubject, Subject } from "rxjs";
import { LeafletMouseEvent } from "leaflet";
@Injectable({ providedIn: "root" })
export class MaprisksService {
  private mapSubject = new ReplaySubject<L.Map>(); // Do not share subject directly, use asObservable instead
  private locationSubject = new Subject<any>();
  public mapObservable: Observable<L.Map>;
  public locationObservable: Observable<any>;
  constructor() {
    this.mapObservable = this.mapSubject.asObservable();
    this.locationObservable = this.locationSubject.asObservable();
  }

  initialize(container: HTMLElement, location?: any): Observable<L.Map> {
    return new Observable((observer) => {
      if (container) {
        const m = new L.Map(container);
        this.mapSubject.next(m);

        L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          maxZoom: 20,
          opacity: 0.5,
          zIndex: 1,
        }).addTo(m);

        if (!location) {
          location = {
            x: 58.6,
            y: 47.9,
            zoom: 2,
          };
        } else {
          location.zoom = 5;
        }

        m.setView(new L.LatLng(location.y, location.x), location.zoom);

        m.whenReady(() => {
          observer.next(m);
          observer.complete();
        });
      }
    });
  }

  addMarker(map: L.Map, location?: Location, editable = true): L.Marker {
    let marker = null;

    if (location) {
      marker = new L.Marker([location.y, location.x], { icon: L.icon({
        iconSize: [28,34],
        iconAnchor: [14, 17],
        iconUrl: 'img/icons/map-marker.png'
      })});
      if(location.address){
        marker.bindPopup(location.address.longLabel);
      }
      marker.addTo(map).openPopup();
    }

    var self = this;
    map.on("click", (e: LeafletMouseEvent) => {
      if(!editable) {
        return;
      }
      if (marker) {
        map.removeLayer(marker);
      }

      esriGeo
        .geocodeService()
        .reverse()
        .latlng(e.latlng)
        .run(function (error, result) {
          if (error) {
            return;
          }

          // get location object
          self.locationSubject.next(result);

          marker = L.marker(result.latlng, { icon: L.icon({
            iconSize: [28,34],
            iconAnchor: [14, 17],
            iconUrl: 'img/icons/map-marker.png'
          })})
            .addTo(map)
            .bindPopup(result.address.Match_addr)
            .openPopup();
        });
    });


    return marker;
  }

  createFeatureGroup(map: L.Map): L.FeatureGroup {
    return L.featureGroup([]).addTo(map);
  }

}
