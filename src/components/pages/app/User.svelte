<script>
  import { onMount } from 'svelte';
  import { Modal } from 'bootstrap';
  import DataTable from '../../widgets/DataTable.svelte';
  import UserDetail from '../../forms/UserDetail.svelte';
	import UserFilters from '../../forms/UserFilters.svelte';
	import RolePermission from '../../forms/RolePermission.svelte';
  
  let userDetailModalInstance;
  let userFormInstance;
  let userDetailModal;
  let alertMessage = {
    text: '',
    status: '',
  };
  let userDataTable;
  let modalTitle;

  let rolePermissionModalInstance;
  let rolePermissionModal;
  let rolePermissionFormInstance;

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

  const editUser = (user) => {
    modalTitle = 'Editar Usuario'
    userFormInstance.clean();
    userFormInstance.loadUser(user);
    userDetailModalInstance.show();
  }

  const handleSearchFilter = (event) => {
    const { name, email } = event.detail;
    userDataTable.queryParams = {name,email};
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

  const handleRolePermissionSave = (event) => {

  }

  onMount(() => {
    // montar acciones de la tabla
      // ejemplos
      //userDataTable.addButton.action = () => userDataTable.addRow();
      //userDataTable.addButton.action = () => userDataTable.goToLink('/users');
      //userDataTable.addButton.action = () => userDataTable.goToHref(BASE_URL + 'hola');
      //userDataTable.addButton.action = () => userDataTable.openTab(BASE_URL + 'hola');
    
    userDetailModalInstance = new Modal(userDetailModal);
    rolePermissionModalInstance = new Modal(rolePermissionModal);
    userDetailModal.addEventListener('hidden.bs.modal', handleClose);
    rolePermissionModal.addEventListener('hidden.bs.modal', () => {});
    // table action buttons
    userDataTable.actionButtons = [
      {
        class: 'btn-secondary',
        icon: 'fa-pencil',
        label: 'Editar',
        action: editUser
      },
      {
        class: 'btn-danger',
        icon: 'fa-trash',
        label: 'Eliminar',
        action: (record) => {
          userDataTable.askToDeleteRow(record, 'id');
        }
      },
    ];
    userDataTable.list();
  });
</script>

<style>

</style>

<div bind:this={userDetailModal} class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog">
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

<div bind:this={rolePermissionModal} class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-xl modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{modalTitle}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <RolePermission 
          bind:this={rolePermissionFormInstance} 
          on:saved={handleRolePermissionSave} />
      </div>
    </div>
  </div>
</div>

<div class="container my-2">
  <div class="row">
    <h1 class="subtitle">Gestión de Usuarios</h1>
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
    <UserFilters 
      on:search={handleSearchFilter} 
      on:clean={handleCleanFilter} />
  </div>
  <div class="row subtitle-row">
    <h4 class="subtitle">Listado de Usuario</h4>
  </div>
  <div class="container">
    <DataTable 
      bind:this={userDataTable}
      fetchURL={API_URL + 'api/v1/users'}
      columnKeys={['id', 'username', 'email', 'created', 'updated']}
      columnTypes={['id', 'td', 'td', 'td-datetime', 'td-datetime']}
      columnNames={['ID', 'Nombre', 'Correo', 'Creado', 'Actualizado', 'Acciones']}
      columnStyles={['max-width: 50px;', 'max-width: 250px;', 'max-width: 400px;', 'max-width: 150px;']}
      columnClasses={['d-none', '', '', '', '', 'text-end']}
      messages = {{
        success: 'Datos actualizados', 
        errorNetwork: 'No se pudo listar los usuarios. No hay conexión con el servidor.',
        notFound: 'No se pudo listar los usuarios. Recurso no encontrado.',
        serverError:'No se pudo listar los usuarios. Error interno del servidor',
        requestError: 'No se pudo listar los usuarios. No se recibió respuesta del servidor',
        otherError: 'No se pudo listar los usuarios. Ocurrió un error no esperado al traer los datos del servidor',
      }}
      addButton={{
        display: true,
        disabled: false,
        action: addUser
      }}
      pagination = {{
        display: true,
        step: 10,
        totalPages: 0,
        actualPage: 1
      }}
      actionButtons={[]} 
      jwtToken={localStorage.getItem('jwtToken')}
      on:alert={handleTableAlert}
    />
  </div>
</div>