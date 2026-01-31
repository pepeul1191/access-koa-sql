<svelte:options accessors={true} />
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let username = '';
  let email = '';
  let statusFilter = 'all'; // Nuevo campo para el filtro de estado

  const searchClick = (event) => {
    event.preventDefault();
    let registredValue;
    if(statusFilter == 'inactive'){
      registredValue = 0;
    }else if(statusFilter == 'active'){
      registredValue = 1;
    }else{
      registredValue = 2;
    }
    dispatch('search', { username, email, status: registredValue });
  };

  const cleanClick = (event) => {
    event.preventDefault();
    if (username || email || statusFilter !== 'all') {
      username = '';
      email = '';
      statusFilter = 'all';
      dispatch('clean');
    }
  };
</script>

<style>
  /* Estilos personalizados si necesitas */
</style>

<form class="mb-4">
  <div class="row">
    <div class="col-md-3">
      <label for="name" class="form-label">Buscar por Nombre</label>
      <input type="text" class="form-control" id="name" placeholder="Nombre" bind:value={username} />
    </div>
    <div class="col-md-3">
      <label for="email" class="form-label">Buscar por Correo</label>
      <input type="text" class="form-control" id="email" placeholder="Correo" bind:value={email} />
    </div>
    <div class="col-md-2">
      <label for="status" class="form-label">Estado</label>
      <select id="status" class="form-select" bind:value={statusFilter}>
        <option value="all">Todos</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
    </div>
    <div class="col-md-3 d-flex align-items-end">
      <button type="submit" class="btn btn-primary me-2" on:click={searchClick}>
        <i class="fa fa-search me-2"></i> Buscar
      </button>
      <button type="reset" class="btn btn-secondary" on:click={cleanClick}>
        <i class="fa fa-eraser me-2"></i> Limpiar
      </button>
    </div>
  </div>
</form>