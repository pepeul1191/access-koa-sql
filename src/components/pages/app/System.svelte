<script>
  import { onMount } from 'svelte';
  import { navigate } from "svelte-routing";
  import { Modal } from 'bootstrap';
  import DataTable from '../../widgets/DataTable.svelte';
  import SystemDetail from '../../forms/SystemDetail.svelte';
	import SystemFilters from '../../forms/SystemFilters.svelte';
	import RolePermission from '../../forms/RolePermission.svelte';
  
  let systemDetailModalInstance;
  let systemFormInstance;
  let systemDetailModal;
  let alertMessage = {
    text: '',
    status: '',
  };
  let systemDataTable;
  let modalTitle;

  let rolePermissionModalInstance;
  let rolePermissionModal;
  let rolePermissionFormInstance;

  const addSystem = () => {
    modalTitle = 'Agregar Sistema'
    systemFormInstance.clean();
    systemDetailModalInstance.show();
  }

  const handleClose = () => {
    // systemDataTable.list();
    // Aquí puedes emitir un evento o cambiar estado
  }

  const handleFormSave = (event) => {
    systemDataTable.list();
    systemDetailModalInstance.hide();
  };

  const editSystem = (system) => {
    modalTitle = 'Editar Sistema'
    systemFormInstance.clean();
    systemFormInstance.loadSystem(system);
    systemDetailModalInstance.show();
  }

  const rolesAndPermission = (system) => {
    modalTitle = 'Gestión de Roles y Permisos del Sistema ' + system.name
    //systemFormInstance.clean();
    //systemFormInstance.loadSystem(system);
    rolePermissionModalInstance.show();
    rolePermissionFormInstance.setSystemId(system);
  }

  const showUsers = (system) => {
    navigate(`/systems/${system.id}/users?name=${system.name}`);
  }

  const handleSearchFilter = (event) => {
    const { name, description } = event.detail;
    systemDataTable.queryParams = {name,description};
    systemDataTable.list();
  }
  
  const handleCleanFilter= () => {
    systemDataTable.queryParams = {};
    systemDataTable.list();
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
      //systemDataTable.addButton.action = () => systemDataTable.addRow();
      //systemDataTable.addButton.action = () => systemDataTable.goToLink('/users');
      //systemDataTable.addButton.action = () => systemDataTable.goToHref(BASE_URL + 'hola');
      //systemDataTable.addButton.action = () => systemDataTable.openTab(BASE_URL + 'hola');
    
    systemDetailModalInstance = new Modal(systemDetailModal);
    rolePermissionModalInstance = new Modal(rolePermissionModal);
    systemDetailModal.addEventListener('hidden.bs.modal', handleClose);
    rolePermissionModal.addEventListener('hidden.bs.modal', () => {});
    // table action buttons
    systemDataTable.actionButtons = [
      {
        class: 'btn-secondary',
        icon: 'fa-list',
        label: 'Roles y Permisos',
        action: rolesAndPermission
      },
      {
        class: 'btn-secondary',
        icon: 'fa-users',
        label: 'Usuarios',
        action: showUsers
      },
      {
        class: 'btn-secondary',
        icon: 'fa-pencil',
        label: 'Editar',
        action: editSystem
      },
      {
        class: 'btn-danger',
        icon: 'fa-trash',
        label: 'Eliminar',
        action: (record) => {
          systemDataTable.askToDeleteRow(record, 'id');
        }
      },
    ];
    systemDataTable.list();
  });
</script>

<style>

</style>

<div bind:this={systemDetailModal} class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{modalTitle}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <SystemDetail 
          bind:this={systemFormInstance} 
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
    <h1 class="mb-2 subtitle">Gestión de Sistemas</h1>
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
    <SystemFilters 
      on:search={handleSearchFilter} 
      on:clean={handleCleanFilter} />
  </div>
  <div class="row subtitle-row">
    <h4 class="subtitle">Listado de Sistemas</h4>
  </div>
  <div class="container">
    <DataTable 
      bind:this={systemDataTable}
      fetchURL={API_URL + 'api/v1/systems'}
      columnKeys={['id', 'name', 'description']}
      columnTypes={['id', 'td', 'td']}
      columnNames={['ID', 'Nombre', 'Descripción', 'Acciones']}
      columnStyles={['max-width: 50px;', 'max-width: 250px;', 'max-width: 400px;', 'max-width: 150px;']}
      columnClasses={['d-none', '', '', 'text-end']}
      tdStyles={['max-width: 50px;', 'max-width: 250px;', 'max-width: 400px;', 'max-width: 150px;']}
      messages = {{
        success: 'Datos actualizados', 
        errorNetwork: 'No se pudo listar los sistemas. No hay conexión con el servidor.',
        notFound: 'No se pudo listar los sistemas. Recurso no encontrado.',
        serverError:'No se pudo listar los sistemas. Error interno del servidor',
        requestError: 'No se pudo listar los sistemas. No se recibió respuesta del servidor',
        otherError: 'No se pudo listar los sistemas. Ocurrió un error no esperado al traer los datos del servidor',
      }}
      addButton={{
        display: true,
        disabled: false,
        action: addSystem
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