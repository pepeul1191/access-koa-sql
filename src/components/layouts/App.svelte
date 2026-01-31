<script>
  import { Router, Route, navigate } from 'svelte-routing';
  
  import Home from '../pages/app/Home.svelte';
  import User from '../pages/app/User.svelte';
  import System from '../pages/app/System.svelte';
  import SystemUsers from '../pages/app/SystemUsers.svelte';

  export let basepath = '/';
</script>
  
<style></style>

<!-- Barra de Navegación -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="/" on:click|preventDefault={() => {navigate('/')}}>Accesos</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="/systems" on:click|preventDefault={() => {navigate('/systems')}}>Sistemas</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/systems" on:click|preventDefault={() => {navigate('/users')}}>Usuarios</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/session">Ver Sesión</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/sign-out">Salir</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<Router basepath="{basepath}">
  <Route path="/" component={User} />
  <Route path="/systems" component={System} />
  <Route path="/users" component={User} />
  <Route path="/systems/:id/users" let:params><SystemUsers id={params.id}/></Route>
</Router>

<!-- Pie de Página -->
<footer class="bg-dark text-white text-center py-3">
  <p>&copy; 2024 Mi Sitio. Todos los derechos reservados.</p>
</footer>