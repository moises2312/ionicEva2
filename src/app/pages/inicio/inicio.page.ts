import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';

import { AlertController, AnimationController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
    , HeaderComponent // CGV-Permite usar el componente Header
    , FooterComponent // CGV-Permite usar el componente Footer
  ]
})
export class InicioPage implements OnInit, AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;

  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();
  public usuario: Usuario;
  public escaneando = false;
  public datosQR: string = '';

  constructor(
    private animationController: AnimationController,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authservice: AuthService
  ) {
    this.usuario = new Usuario();
      this.authservice.leerUsuarioAutenticado().then((usuario) =>{ 
        if (usuario) {
          this.usuario= usuario;
        }
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.animarTituloIzqDer();
  }

  animarTituloIzqDer() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(9000)
      .fromTo('transform', 'translate(-50%)', 'translate(100%)')
      .fromTo('opacity', 0.5, 1)
      .play();
  }

  public async comenzarEscaneoQR() {
    try {
      const mediaProvider = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      this.video.nativeElement.srcObject = mediaProvider;
      this.video.nativeElement.setAttribute('playsinline', 'true');
      this.video.nativeElement.play();
      this.escaneando = true;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo acceder a la cámara. Asegúrate de que los permisos estén habilitados.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d', { willReadFrequently: true });
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      if (qrCode.data !== '') {
        this.escaneando = false;
        this.mostrarDatosQROrdenados(qrCode.data);
        return true;
      }
    }
    return false;
  }

  public mostrarDatosQROrdenados(datosQR: string): void {
    this.datosQR = datosQR;
    // Aquí puedes procesar los datos QR como necesites
  }

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

  navegar(pagina: string) {
    this.usuario.navegarEnviandousuario(this.router, pagina);
  }

  // Método para abrir el menú
  abrirMenu() {
    // Código para abrir el menú (puedes usar el método del menú si lo necesitas)
  }
}

