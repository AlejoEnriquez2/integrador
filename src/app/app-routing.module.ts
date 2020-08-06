import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./shared/pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./shared/pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'direccion',
    loadChildren: () => import('./shared/pages/direccion/direccion.module').then( m => m.DireccionPageModule)
  },
  {
    path: 'solicitar',
    loadChildren: () => import('./shared/pages/solicitar/solicitar.module').then( m => m.SolicitarPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./shared/pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'inicio-e',
    loadChildren: () => import('./shared/pages/inicio-e/inicio-e.module').then( m => m.InicioEPageModule)
  },
  {
    path: 'solicitud/:id',
    loadChildren: () => import('./shared/pages/solicitud/solicitud.module').then( m => m.SolicitudPageModule)
  },  {
    path: 'mensajes',
    loadChildren: () => import('./shared/pages/mensajes/mensajes.module').then( m => m.MensajesPageModule)
  },
  {
    path: 'solicitudes',
    loadChildren: () => import('./shared/pages/solicitudes/solicitudes.module').then( m => m.SolicitudesPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
