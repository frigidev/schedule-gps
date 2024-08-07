import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardTitle, IonButton, IonItem, IonCardContent, IonCard, NavController } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ToastController } from '@ionic/angular';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrl: 'tab3.page.scss',
  standalone: true,
  imports: [IonCard, IonCardContent, IonItem, IonButton, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab3Page {

  @ViewChild('map')mapRef!: ElementRef;
  map!: GoogleMap;

  latitude: number | undefined = 0.0;
  longitude: number | undefined = 0.0;
  permission: PermissionStatus | undefined;

  watchId: any;

  control = false;

  firstMapLoad = true;

  options = {
    enableHighAccuracy: true,
    maximumAge: 0
  };

  constructor(
    private readonly toast: ToastController,
    private readonly zone: NgZone,
    private navCtrl: NavController
  ) {}

  ionViewDidEnter(): void {
    if (Capacitor.isNativePlatform()) {
      this.requestPermissions();
      this.getCurrentInitialPosition().then(() => {
        this.createNewMap();
      }).catch(error => console.error(error));
    } else {
      this.getBrowserLocation().then(() => {
        this.createNewMap(); 
      });
    }
  };

  async getBrowserLocation() {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      this.zone.run(() => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    } catch (error) {
      console.error('Error getting location:', error);
      const toast = await this.toast.create({
        message: 'Error getting the location. Verify the permissions of your browser.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  async createMap(){
    if(this.control){
      return;
    }
    try{
      this.map = await GoogleMap.create({
        id: 'map-gps',
        apiKey: environment.mapsKey!,
        element: this.mapRef.nativeElement,
        forceCreate: true,
        config: {
          center: {
            lat: this.latitude!,
            lng: this.longitude!,
          },
          zoom: 8,
        },
      });
      await this.addMarkers();
    }catch(e){
      const toast = this.toast.create({
        header: 'Error',
        message: `Error creating the map: ${e}`,
        duration: 3000,
        position: 'top'
      });
    };
  };

  async createNewMap(){
    try{
      this.map = await GoogleMap.create({
        id: 'map-gps',
        apiKey: environment.mapsKey!,
        element: this.mapRef.nativeElement,
        forceCreate: true,
        config: {
          center: {
            lat: this.latitude!,
            lng: this.longitude!,
          },
          zoom: 8,
        },
      });
      await this.addMarkers();
    }catch(e){
      const toast = this.toast.create({
        header: 'Error',
        message: `Error creating the map: ${e}`,
        duration: 3000,
        position: 'top'
      });
    };
  };

  /* If it is the first time loading this tab, the map will not load correctly based on the user position.
    This function below navigate to an auxiliary route and guarantee that the map will be loaded correctly,
    otherwhise, an error message is displayed*/
  async reloadPage(){
    this.firstMapLoad = false;
    await this.navCtrl.navigateRoot('/tabs/aux-route', {skipLocationChange: true}).then(() => {
      this.navCtrl.navigateForward('/tabs/tab3', {replaceUrl: true});
    }).catch(async err => {
        const message = await this.toast.create({
          header: 'Error',
          message: `Error loading the map: ${err}`,
          duration: 4000,
          position: 'top'
        });
        await message.present();
    });
  };

  async addMarkers(){
    const markers: Marker[] = [
      {
        coordinate: {
          lat: this.latitude!,
          lng: this.longitude!,
        },
        title: 'Current location'
      }
    ];
    await this.map.addMarkers(markers);
  };

  async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      const permission = await Geolocation.requestPermissions();
      this.permission = permission;
    }
  };

  async getCurrentInitialPosition(){
    if(Capacitor.isNativePlatform()) {
      const message = await this.toast.create({
        message: 'Finding location',
        position: 'top',
        duration: 2000
      });
  
      await message.present();
      
      const currentLocation = await Geolocation.getCurrentPosition(this.options);
  
      this.latitude = currentLocation?.coords?.latitude;
      this.longitude = currentLocation?.coords?.longitude;
    }
  };

  async getCurrentPosition(){
    if(Capacitor.isNativePlatform()) {
      const message = await this.toast.create({
        message: 'Finding location',
        position: 'top',
        duration: 2000
      });
  
      await message.present();
  
      const currentLocation = await Geolocation.getCurrentPosition(this.options);
  
      this.latitude = currentLocation?.coords?.latitude;
      this.longitude = currentLocation?.coords?.longitude;  
  
      this.reloadPage().then(() => {
        this.createMap();
      });
    }
  };

  watchPosition(){
    if (Capacitor.isNativePlatform()) {
      if(this.watchId){
        return;
      };
      if(this.control){
        this.control = false;
      };
      const watchId = Geolocation.watchPosition(this.options, async(coordinates, err) => {
        this.zone.run(() => {
          this.latitude = coordinates?.coords.latitude
          this.longitude = coordinates?.coords.longitude
        });
  
        if(err){
          const toast = await this.toast.create({
            message: `${err}`,
            duration: 3000
          });
  
          await toast.present(); 
        };
        await this.createMap();
      });
      this.watchId = watchId;
    } else {
        if (this.watchId) {
          return; 
        }

        this.watchId = navigator.geolocation.watchPosition(
          (position) => {
            this.zone.run(() => {
              this.latitude = position.coords.latitude;
              this.longitude = position.coords.longitude;
            });
          },
          (error) => {
            console.error('Error monitoring location:', error);
          },
          this.options
        );
    }
  };

  clearWatch() {
    if (Capacitor.isNativePlatform()) {
      if (this.watchId) {
        Geolocation.clearWatch({ id: this.watchId });
        this.watchId = undefined;
        this.control = true;
      }
    } else {
      if (this.watchId) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = undefined;
      }
    }
  };
}