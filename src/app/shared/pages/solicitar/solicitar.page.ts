import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Solicitud } from '../../models/solicitud';
import { AuthService } from '../../services/auth.service';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { tap, finalize, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ServicioService } from '../../services/servicio.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-solicitar',
  templateUrl: './solicitar.page.html',
  styleUrls: ['./solicitar.page.scss'],
})
export class SolicitarPage implements OnInit {

  user: any;

  imagenes: any = [];
  urls: any = [];
  servicios: Observable<any[]>;
  solicitud: Solicitud = new Solicitud;

  constructor(private auth: AuthService,
    private file: File, 
    private solicitudService: SolicitudService,
    private servicioservice: ServicioService,
    public router: Router,
    private toastController: ToastController,
    private storage: AngularFireStorage,
    private loadingCtrl: LoadingController,
    fb: FormBuilder) { }

  ngOnInit() {
    this.auth.user.subscribe(data => {
      this.user = data;
      this.solicitud.uid_usuario = data.uid;
    })
    this.servicios = this.servicioservice.getServicios();
  }

  imagenCargada(e) {
    console.log("imagen cargada");
    this.imagenes.push(e);
  }

  async upload() {

    if (this.solicitud.servicios == undefined) {
      alert("Debe seleccionar por lo menos un tipo de servicio")
    } else {
      console.log(this.imagenes.length)

      if (this.imagenes.length > 0) {
        this.solicitudService.uploadFiles(this.imagenes)
        .then(async values => {
          if (values == null) {
            alert("error")
            return
          } else {
            this.imagenes.map(async file => {
              this.urls.push(file.url)
            })
            await this.guardarSolicitud()
          }
        })
        .catch(err => {
          console.error("Error ", JSON.stringify(err));
          alert(JSON.stringify(err))
        });
      } else {
        await this.guardarSolicitud();
      }

    }
  }

  guardarSolicitud() {
    this.solicitud.galeria_antes = this.urls
    var today = new Date()
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    this.solicitud.fecha_inicio = date
    this.solicitud.estado = 'solicitando'
    this.solicitudService.insertSolicitud(this.solicitud)
    this.toast('Servicio solicitado');
    this.router.navigate([`inicio`])
  }

  async getUrls(base64) {
    const url = await this.solicitudService.startUpload(base64)
    this.urls.push(url)
  }

  mostrar() {
    console.log(this.urls)
  }

  async getUrls2() {
    for (var i = 0; i < this.imagenes.length; i++) {
      console.log(i)
      const file = this.imagenes[i]
      let byteCharacters = atob(file);
      const path = `solicitudes/${new Date().getTime()}`;
      let image = 'data:image/jpg;base64,'+file;
        
      try{
        let ref = this.storage.ref(path);    
        let task = ref.putString(image, 'data_url');
        const loading = await this.loadingCtrl.create({
          message: 'Espere, subiendo fotografía...'
        });  
        await loading.present(); 
  
        //Listener de progreso de carga
        task.percentageChanges().pipe(
          filter(val => val === 100),
          tap(complete => {
            setTimeout(() => {
              loading.dismiss();
            }, 3500);
          })
        ).subscribe();
  
        task.snapshotChanges().pipe(
          finalize(() => {
            let downloadURL = ref.getDownloadURL()
            downloadURL.subscribe(url => {
              console.log("download terminado ");
              this.urls.push(url);
              console.log('log de urls', this.urls)
            });
          })
        )
        .subscribe();
      }catch(error){
        console.error(JSON.stringify(error));
        console.error("error ");
      }
    }
    return
  }

  async toast(text: string, duration: number = 2500, position?) {
    const toast = await this.toastController.create({
      message: text,
      position: position || 'middle',
      duration: duration
    });
    toast.present();
  }


}
