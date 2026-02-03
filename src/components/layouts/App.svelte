<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import { onMount } from 'svelte';
  
  import Home from '../pages/app/Home.svelte';
  import User from '../pages/app/User.svelte';
  import System from '../pages/app/System.svelte';
  import SystemUsers from '../pages/app/SystemUsers.svelte';

  export let basepath = '/';

  onMount(() => {
    fetchTokensIfMissing()
      .then(function() {
        console.log('Tokens listos para usar.');
      })
      .catch(function(err) {
        console.error('No se pudieron obtener los tokens:', err);
      });
  });

  const fetchTokensIfMissing = () => {
    // Verificar si los tokens ya existen
    var jwtToken = localStorage.getItem('jwtToken');

    // Si ambos tokens ya están guardados, no hacer nada
    if (jwtToken) {
      console.log('Token ya existen en localStorage.');
      return Promise.resolve(); // Salir sin hacer la petición
    }

    // Si alguno falta, hacer el GET a /tokens
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/v1/sessions', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const genericResponse = JSON.parse(xhr.responseText);
          var token = genericResponse.data.jwt;

          // Guardar ambos tokens en localStorage
          if (token) {
            localStorage.setItem('jwtToken', token);
          }

          console.log('Token guardado en localStorage.');
          resolve();
        } else {
          reject(new Error('Error HTTP: ' + xhr.status));
        }
      };

      xhr.onerror = function() {
        reject(new Error('Error de red'));
      };

      xhr.send();
    })
    .catch(function(error) {
      console.error('Error al obtener tokens:', error);
      return Promise.reject(error);
    });
  }
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