import { Component, ChangeDetectorRef } from '@angular/core';
import { IonHeader, IonContent, IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { caretUpCircle, caretDownCircle } from 'ionicons/icons';

type PreferencesPlugin = {
  get: (options: { key: string }) => Promise<{ value?: string | null }>;
  set: (options: { key: string; value: string }) => Promise<void>;
};

const Preferences: PreferencesPlugin = (globalThis as any).Capacitor?.Preferences ?? {
  get: async () => ({ value: null }),
  set: async () => undefined,
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonIcon, IonButton, IonHeader, IonContent]
})
//Aquí va toda la lógica de la página
//Variables y Métodos
export class HomePage {

  public numero: number = 0;
  public historial: string[] = [];

  //Constantes
  //Readonly evita el valor almacenado en una constante cambie
  public readonly MINIMO: number = 0;
  public readonly MAXIMO: number = 9;
  private readonly KEY_NUMBER: string = 'ddr_kry_number';
  private readonly KEY_HISTORIAL: string = 'ddr_key_historial';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private cdr: ChangeDetectorRef) {
    addIcons({
      caretUpCircle,
      caretDownCircle
    });
  }

  saveNumber() {
    Preferences.set({
      key: this.KEY_NUMBER,
      value: this.numero.toString(),
    });
  }

  // Carga el historial desde memoria (igual al del profe)
  private async loadHistorialFromMemory() {
    const saved = await Preferences.get({ key: this.KEY_HISTORIAL });
    if (saved.value) {
      this.historial = JSON.parse(saved.value);
      console.log(' [HISTORIAL CARGADO AL INICIAR]:');
      console.table(this.historial);
    } else {
      console.log(' [HISTORIAL]: No hay tareas previas en memoria.');
    }
  }

  private async saveHistorialToMemory(action: string) {
    this.historial.push(`${action}: ${this.numero}`);
    await Preferences.set({
      key: this.KEY_HISTORIAL,
      value: JSON.stringify(this.historial),
    });
    console.log(` [HISTORIAL EN MEMORIA - Acción: ${action}]:`);
    console.table(this.historial);
  }

  async ionViewWillEnter() {
    console.log('ionViewWillEnter');

    const counterPreferences = await Preferences.get({ key: this.KEY_NUMBER });
    if (counterPreferences.value) {
      const numero = +counterPreferences.value;
      if (isNaN(numero) || numero < this.MINIMO || numero > this.MAXIMO) {
        this.numero = this.MINIMO;
        this.saveNumber();
      } else {
        this.numero = numero;
        this.cdr.detectChanges();
      }
    }


    await this.loadHistorialFromMemory();
  }

  counterUp() {
    if (this.numero < this.MAXIMO) {
      //this.numero = this.numero + 1;
      this.numero++;
      this.saveNumber();
      this.saveHistorialToMemory('Incremento');
      console.log('Up', this.numero);
    }
  }

  counterDown() {
    if (this.numero > this.MINIMO) {
      //this.numero = this.numero - 1;
      this.numero--;
      this.saveNumber();
      this.saveHistorialToMemory('Decremento');
    }
  }
}