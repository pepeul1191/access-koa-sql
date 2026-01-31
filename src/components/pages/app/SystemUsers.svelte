<script>
  import { onMount } from 'svelte';
  import { useLocation } from "svelte-routing";
  import { Modal } from 'bootstrap';
  import DataTable from '../../widgets/DataTable.svelte';
  import UserDetail from '../../forms/UserDetail.svelte';
	import SystemUsersFilters from '../../forms/SystemUsersFilters.svelte';
	import PermissionsUsers from '../../forms/PermissionsUsers.svelte';
  
  let userDetailModalInstance;
  let userFormInstance;
  let userDetailModal;
  let alertMessage = {
    text: '',
    status: '',
  };
  export let id = null;
  let userDataTable;
  let modalTitle;
  let name = '';
  let permissionsUsersModalInstance;
  let permissionsUsersModal;
  let permissionsUsersFormInstance;

  const addUser = () => {
    modalTitle = 'Agregar Usuario'
    userFormInstance.clean();
    userDetailModalInstance.show();
  }

  const handleClose = () => {
    // userDataTable.list();
    // Aquí puedes emitir un evento o cambiar estado
  }

  const handleFormSave = (event) => {
    userDataTable.list();
    //userDetailModalInstance.hide();
    modalTitle = 'Editar Usuario';
  };

  const assignPermissions = (user) => {
    console.log(user)
    modalTitle = `Asignar Permisos al Usuario ${user.username}`;
    permissionsUsersModalInstance.show();
    permissionsUsersFormInstance.set(id, user.id);
  }

  const handleSearchFilter = (event) => {
    const { username, email, status } = event.detail;
    userDataTable.queryParams = {username,email, status};
    userDataTable.list();
  }
  
  const handleCleanFilter= () => {
    userDataTable.queryParams = {};
    userDataTable.list();
  }

  const handleTableAlert = (callback) => { 
    alertMessage = callback.detail;
    setTimeout(() => {
      alertMessage = {
        text: '',
        status: '',
      };
    }, 4300);
  }

  const handleUserPermissionsSave = (event) => {

  }

  onMount(() => {
    // montar acciones de la tabla
      // ejemplos
      //userDataTable.addButton.action = () => userDataTable.addRow();
      //userDataTable.addButton.action = () => userDataTable.goToLink('/users');
      //userDataTable.addButton.action = () => userDataTable.goToHref(BASE_URL + 'hola');
      //userDataTable.addButton.action = () => userDataTable.openTab(BASE_URL + 'hola');
    
    userDetailModalInstance = new Modal(userDetailModal);
    permissionsUsersModalInstance = new Modal(permissionsUsersModal);
    userDetailModal.addEventListener('hidden.bs.modal', handleClose);
    permissionsUsersModal.addEventListener('hidden.bs.modal', () => {});
    // table action buttons
    userDataTable.actionButtons = [
      {
        class: 'btn-secondary',
        icon: 'fa-list',
        label: 'Asignar Permisos',
        action: assignPermissions
      },
    ];
    userDataTable.list();
    const queryString = window.location.search;
    if (queryString) {
      const params = new URLSearchParams(queryString);
      name = params.get("name");
    }
  });
</script>

<style>

</style>

<div bind:this={userDetailModal} class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{modalTitle}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <UserDetail 
          bind:this={userFormInstance} 
          on:saved={handleFormSave} />
      </div>
    </div>
  </div>
</div>

<div bind:this={permissionsUsersModal} class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{modalTitle}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <PermissionsUsers 
          bind:this={permissionsUsersFormInstance} 
          on:saved={handleUserPermissionsSave} />
      </div>
    </div>
  </div>
</div>

<div class="container my-2">
  <div class="row">
    <h1 class="mb-2 subtitle">Usuarios del Sistema - {name}</h1>
  </div>
  <hr>
  <div class="row subtitle-row">
    <h4 class="subtitle">Filtros de Búsqueda</h4>
  </div>
  {#if alertMessage.text != ''}
    <div class="alert alert-{alertMessage.status}" role="alert">
      {alertMessage.text}
    </div>
  {/if}
  <div class="container">
    <SystemUsersFilters 
      on:search={handleSearchFilter} 
      on:clean={handleCleanFilter} />
  </div>
  <div class="row subtitle-row">
    <h4 class="subtitle">Listado de Usuario</h4>
  </div>
  <div class="container">
    <div class="col-md-10">
      <DataTable 
        bind:this={userDataTable}
        fetchURL={API_URL + 'api/v1/systems/' + id + '/users'}
        columnKeys={['id', 'username', 'email', 'registered']}
        columnTypes={['id', 'td', 'td', 'radiobuttonAll']}
        columnNames={['ID', 'Nombre', 'Correo', 'Registrado', 'Acciones']}
        columnStyles={['max-width: 50px;', 'max-width: 250px;', 'max-width: 150px;', '']}
        tdStyles={['', '', '', 'padding-left: 40px;']}
        columnClasses={['d-none', '', '', '', 'text-end']}
        messages = {{
          success: 'Datos actualizados', 
          errorNetwork: 'No se pudo listar los usuarios. No hay conexión con el servidor.',
          notFound: 'No se pudo listar los usuarios. Recurso no encontrado.',
          serverError:'No se pudo listar los usuarios. Error interno del servidor',
          requestError: 'No se pudo listar los usuarios. No se recibió respuesta del servidor',
          otherError: 'No se pudo listar los usuarios. Ocurrió un error no esperado al traer los datos del servidor',
        }}
        saveButton={{
          display: true,
          disabled: false,
        }}
        pagination = {{
          display: true,
          step: 10,
          totalPages: 0,
          actualPage: 1
        }}
        actionButtons={[]} 
        on:alert={handleTableAlert}
        jwtToken={localStorage.getItem('jwtToken')}
      />
    </div>
  </div>
</div>