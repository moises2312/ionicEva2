import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CorrectoPage implements OnInit {

  public usuario: Usuario | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController // Para mensajes emergentes
  ) {}

  async ngOnInit() {
    // Obtén el usuario autenticado al iniciar el componente
    this.usuario = this.authService.getAuthenticatedUser();
    if (!this.usuario) {
      // Si no hay usuario, redirige a la página de ingreso y muestra un mensaje

      this.router.navigateByUrl('/ingreso');
    }
  }

  async navegarALogin() {
    // Redirige a la página de ingreso con mensaje de confirmación
    this.router.navigateByUrl('/ingreso');
  }

}
