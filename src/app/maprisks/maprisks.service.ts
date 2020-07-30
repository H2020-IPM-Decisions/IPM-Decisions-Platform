import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { ReplaySubject, Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class MaprisksService {
    private mapSubject = new ReplaySubject<L.Map>(); // Do not share subject directly, use asObservable instead
    public mapObservable: Observable<L.Map>;
    constructor(private router: Router) {
        this.mapObservable = this.mapSubject.asObservable();

    }
    

    initialize(containerId: string): Observable<L.Map> {

        return new Observable(observer => {

            if (true && !!document.getElementById(containerId)) {
                const m = new L.Map(containerId);
                this.mapSubject.next(m);
                
                L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                    maxZoom: 20,
                    opacity: 0.5,
                    zIndex: 1
                }).addTo(m);

                m.setView(new L.LatLng(47.4744951, 10.9576836), 5)

                m.whenReady(() => {
                    observer.next(m);
                    observer.complete();
                });
            }

        });
    }
    
    addMarker(latitude: number, longitude: number, feature:L.FeatureGroup): L.Marker {
        //var myIcon = L.icon({
          //  iconUrl: 'pin-mappa-green40.png',
            //iconSize: [38, 95],
            //iconAnchor: [22, 94], 
            //popupAnchor: [-3, -76],
            //shadowUrl: 'my-icon-shadow.png',
            //shadowSize: [68, 95],
            //shadowAnchor: [22, 94] 
            //{icon: myIcon}
        //});
        
        var popup = L.popup({
            maxWidth:400
        });
        
        const marker = new L.Marker([latitude, longitude],);

        marker.bindPopup("ciao").openPopup();
        
        
        marker.on('click', event => {
            // TODO
            console.log("ciao");
           
            
          });
          marker.addTo(feature);

        return marker;
    }

    createFeatureGroup(map: L.Map): L.FeatureGroup {
        return L.featureGroup([]).addTo(map);
      }

}

