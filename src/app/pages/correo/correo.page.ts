import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from './../../model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class CorreoPage implements OnInit {

  correoForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private router: Router, private toastController: ToastController) {}

  ngOnInit() {}

  async ingresarValidarRespuestaSecreta(): Promise<void> {
    if (this.correoForm.valid) {
      const correoIngresado = this.correoForm.get('correo')?.value;

      // Crear usuario y buscar usando buscarUsuarioPorCuenta
      const usuario = new Usuario(); // Ajusta la inicialización según el constructor de Usuario
      const usuarioEncontrado = await usuario.buscarUsuarioPorCuenta(correoIngresado!);

      if (!usuarioEncontrado) {
        this.router.navigate(['/incorrecto']);
      } else {
        // Guardar el usuario en un servicio de autenticación o almacenamiento
        // AuthService.storeAuthenticatedUser(usuarioEncontrado);
        this.router.navigate(['/pregunta']);
      }
    } else {
      // Mostrar mensaje de error en caso de formato de correo inválido
      const toast = await this.toastController.create({
        message: 'Formato de correo inválido.',
        duration: 2000,
        position: 'top'
      });
      await toast.present();
    }
  }
}
