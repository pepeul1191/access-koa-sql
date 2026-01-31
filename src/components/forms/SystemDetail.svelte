<svelte:options accessors={true} />
<script>
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';
  import { toDatetimeLocalWithSeconds } from '../../helpers/datetime.js';
  
  const dispatch = createEventDispatcher();

  const jwtToken = localStorage.getItem('jwtToken');

  export let id = null;
  let name = '';
  let description = '';
  let repository = '';
  let created = '';
  let updated = '';
  let btnDisabled = false;
  let message = {
    text: '',
    status: ''
  };

  export const clean = () => {
    id = null;
    name = '';
    description = '';
    repository = '';
    created = '';
    updated = '';
    btnDisabled = false;
    message = {
      text: '',
      status: ''
    };
  }

  export const loadSystem = (system) => {
    id = system.id;
    name = system.name;
    description = system.description;
    repository = system.repository;
    created = toDatetimeLocalWithSeconds(system.created);
    updated = toDatetimeLocalWithSeconds(system.updated);
  }  

  const cleanMessage = (dispatchToParent) => {
    setTimeout(() => {
      message = {
        text: '',
        status: ''
      };
      btnDisabled = false;
      if (dispatchToParent){
        dispatch('saved', { id });
      }
    }, 4300);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();  // Evita el comportamiento por defecto del formulario (recargar la página)
    // Crea un objeto con los datos del formulario
    try {
      // Enviar datos usando Axios
      const formData = {
        id,
        name,
        description,
        repository,
      };
      let response;
      btnDisabled = true;
      if(id == null){
        response = await axios.post(API_URL + 'api/v1/systems', formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
        });
        created = toDatetimeLocalWithSeconds(response.data.created);
        updated = toDatetimeLocalWithSeconds(response.data.updated);
        id = response.data.id;
        message.text = 'Se ha creado el sistema';
        message.status = 'success';
        // notificar al padre que se ha actualizado algo
        cleanMessage(true);
      }else{
        response = await axios.put(API_URL + 'api/v1/systems', formData, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });  
        updated = toDatetimeLocalWithSeconds(response.data.updated);
        message.text = 'Se ha editado el sistema';
        message.status = 'success';
        cleanMessage(true);
      }
      console.log('Datos enviados con éxito:', response.data);
      // Puedes manejar la respuesta aquí, por ejemplo, mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      message.text = 'Error al grabar el sistema';
      message.status = 'danger';
      cleanMessage(false);
      // Maneja el error (puedes mostrar un mensaje de error en la interfaz de usuario)
    }
  };
</script>

<style></style>

<form on:submit|preventDefault={handleSubmit}>
  {#if message.text != ''}
    <div class="alert alert-{message.status}" role="alert">
      {message.text}
    </div>
  {/if}
  <div class="mb-3">
    <label for="name" class="form-label">Nombre del Sistema</label>
    <input type="text" class="form-control" id="name" name="name" bind:value={name} required maxlength="40" placeholder="Ingrese el nombre del sistema">
  </div>
  <div class="mb-3">
    <label for="description" class="form-label">Descripción</label>
    <textarea class="form-control" id="description" name="description" bind:value={description} rows="4" placeholder="Ingrese una descripción del sistema"></textarea>
  </div>
  <div class="mb-3">
    <label for="repository" class="form-label">Repositorio</label>
    <input type="text" class="form-control" id="repository" name="repository" bind:value={repository} maxlength="100" placeholder="Ingrese la URL del repositorio">
  </div>
  <!-- Fila para las fechas -->
  <div class="row mb-3">
    <div class="col-6">
      <label for="created" class="form-label">Fecha de Creación</label>
      <input type="datetime-local" class="form-control" id="created" name="created" bind:value={created} required disabled>
    </div>
    <div class="col-6">
      <label for="updated" class="form-label">Fecha de Actualización</label>
      <input type="datetime-local" class="form-control" id="updated" name="updated" bind:value={updated} required disabled>
    </div>
  </div>
  <div class="text-end">
    <button type="submit" class="btn btn-success mt-1"  disabled={btnDisabled}>
      <i class="fa fa-check"></i>Guardar Sistema
    </button>
  </div>
</form>
  