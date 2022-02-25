import { Injectable } from "@angular/core";
import * as L from "leaflet";
import 'leaflet-fullscreen';
import * as esriGeo from "esri-leaflet-geocoder";
import { Location } from "@app/shared/models/location.model";
import { ReplaySubject, Observable, of, BehaviorSubject, Subject } from "rxjs";
import { LeafletMouseEvent } from "leaflet";
import { NGXLogger } from "ngx-logger";

@Injectable({ providedIn: "root" })
export class MaprisksService {
  private mapSubject = new ReplaySubject<L.Map>(); // Do not share subject directly, use asObservable instead
  private locationSubject = new Subject<any>();
  public mapObservable: Observable<L.Map>;
  public locationObservable: Observable<any>;
  constructor(private _logger: NGXLogger) {
    this.mapObservable = this.mapSubject.asObservable();
    this.locationObservable = this.locationSubject.asObservable();
  }

  initialize(container: HTMLElement, location?: any): Observable<L.Map> {
    let isDefaultLocation: boolean = false;
    return new Observable((observer) => {
      if (container) {
        const m = new L.Map(container);
        this.mapSubject.next(m);
// 
// https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png
        /*L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
          maxZoom: 20,
          subdomains:['mt0','mt1','mt2','mt3'],
          opacity: 0.5,
          zIndex: 1,
        }).addTo(m);*/

        var googleHybrid = L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
          maxZoom: 20,
          subdomains:['mt0','mt1','mt2','mt3'],
          opacity: 0.75,
          zIndex: 1,
        });

        var openTopoMap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          maxZoom: 20,
          opacity: 0.5,
          zIndex: 1,
        });

        openTopoMap.addTo(m);

        var baseMaps = {
          "Map": openTopoMap,
          "Satellite": googleHybrid     
        };

        L.control.layers(baseMaps).addTo(m);

        if (!location) {
          location = {
            x: 25.3167,
            y: 54.9000,
            zoom: 3,
          };
          isDefaultLocation = true
        } else {
          location.zoom = 7;
        }

        m.setView(new L.LatLng(location.y, location.x), location.zoom);
        m.addControl(new (L.Control as any).Fullscreen({position: 'bottomright'}));
        m.doubleClickZoom.disable();
        m.whenReady(() => {
          m.openPopup
          observer.next(m);
          observer.complete();
        });
      }
    });
  }

  public getBrowserLocation(): Observable<Location> {
    return new Observable(observer => {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(location => {
          observer.next({y:location.coords.latitude, x: location.coords.longitude, zoom: 7});
          observer.complete();
        });
      } else {
        this._logger.error("This browser does not support the geolocation!");
        observer.next({y:54.9000, x: 25.3167, zoom: 4});
        observer.complete();
      }
    });
  }

  public flyToLocation(map: L.Map, location: Location): void {
    let latLng = L.latLng(location.y,location.x);
    map.flyTo(latLng,location.zoom);
  }

  addMarker(map: L.Map, location?: Location, editable = true): L.Marker {
    var markers = new L.FeatureGroup();
    let marker = null;
    if (location) {
      marker = new L.Marker([location.y, location.x], { icon: L.icon({
        iconSize: [42,50],
        iconAnchor: [21, 47],
        popupAnchor: [1,-39],
        iconUrl: 'img/icons/marker-icon-farm.png',
        shadowUrl: 'img/icons/marker-shadow.png'
      })});
      if(location.address){
        marker.bindPopup(location.address.LongLabel,{autoClose:false});
      }
      //marker.addTo(map).openPopup();
      //markers.clearLayers();
      markers.addLayer(marker);
      map.addLayer(markers);
      marker.openPopup();
    }

    var self = this;
    map.on("click", (e: LeafletMouseEvent) => {
      map.removeLayer(markers);
      if(!editable) {
        return;
      }
      if (marker) {
        //map.removeLayer(marker);
        markers.clearLayers();
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
            iconSize: [42,50],
            iconAnchor: [21, 47],
            popupAnchor: [1,-39],
            iconUrl: 'img/icons/marker-icon-farm.png',
            shadowUrl: 'img/icons/marker-shadow.png'
          })});

            //.addTo(map)
            marker.bindPopup(result.address.Match_addr);
            //markers.clearLayers();
            markers.addLayer(marker);
            map.addLayer(markers);
            marker.openPopup();
        });
    });
    
    return marker;
  }

  createFeatureGroup(map: L.Map): L.FeatureGroup {
    return L.featureGroup([]).addTo(map);
  }

}
