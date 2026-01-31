<svelte:options accessors={true} />
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let name = '';
  let email = '';

  const searchClick = (event) => {
    event.preventDefault();
    dispatch('search', {name, email});
  }

  const cleanClick = (event) => {
    event.preventDefault();
    if (name || email) {
      // Si al menos uno de los campos tiene valor, limpiamos ambos y disparamos el evento
      name = '';
      email = '';
      dispatch('clean');
    }
  }
</script>

<style>

</style>

<form class="mb-4">
  <div class="row">
    <div class="col-md-3">
      <label for="name" class="form-label">Buscar por Nombre</label>
      <input type="text" class="form-control" id="name" placeholder="Nombre" bind:value={name}>
    </div>
    <div class="col-md-3">
      <label for="email" class="form-label">Buscar por Correo</label>
      <input type="text" class="form-control" id="email" placeholder="Descripción" bind:value={email}>
    </div>
    <div class="col-md-4 d-flex align-items-end">
      <button type="submit" class="btn btn-primary me-2" on:click={searchClick}>
        <i class="fa fa-search me-2"></i> Buscar
      </button>
      <button type="reset" class="btn btn-secondary" on:click={cleanClick}>
        <i class="fa fa-eraser me-2"></i> Limpiar
      </button>
    </div>
  </div>
</form>