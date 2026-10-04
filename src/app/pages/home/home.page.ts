import { Component } from '@angular/core';
import { IonHeader, IonContent, IonButton, IonFooter, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowUp, arrowDown } from 'ionicons/icons';
import { Preferences  } from '@capacitor/preferences';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonContent, IonButton, IonFooter, IonIcon],
})
export class HomePage {
  public numero: number = 0;
  public readonly MINIMO: number = 0;
  public readonly MAXIMO: number = 999;

  private readonly KEY_NUMBER: string = 'ddr_key_nuumber'
  
  constructor(private cdr: ChangeDetectorRef) {
    addIcons({ arrowUp, arrowDown }); 
  }

  saveNumber(){
    Preferences.set({
      key: this.KEY_NUMBER,
      value: this.numero.toString(),
    });
  }

   async ionViewWillEnter() {
    console.log('ionViewWillEnter'); 'ionViewWillEnter'

    const counterPreferences = await Preferences.get({ key: this.KEY_NUMBER });
    if(counterPreferences.value){
      const numero = +counterPreferences.value;
      if (isNaN(numero) || numero < this.MINIMO || numero > this.MAXIMO){
        this.numero = this.MINIMO
        this.saveNumber();
      } else {
        this.numero = numero
        this.cdr.detectChanges();
      }
    }
  }

  counterUp() {
    if (this.numero < this.MAXIMO)
    this.numero = this.numero + 1;
  this.saveNumber();
  console.log('Up', this.numero);
  }

  counterDown() {
    if (this.numero > this.MINIMO)
    this.numero = this.numero - 1;
  }
} 