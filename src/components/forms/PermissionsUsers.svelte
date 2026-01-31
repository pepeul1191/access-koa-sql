<svelte:options accessors={true} />
<script>
  import { onMount } from 'svelte';
  import DataTable from '../widgets/DataTable.svelte';

  export let systemId = 0;
  export let userId = 0;
  let roleId = null;
  let permissionId = null;

  onMount(() => {
    console.log(systemId);
    console.log(userId);
  });

  let alertMessage = {
    text: '',
    status: ''
  };
  let rolesDataTable;
  let permissionsDataTable;
  let displayPermission = false;

  export const set = (systemIdN, userIdN) => {
    systemId = systemIdN;
    userId = userIdN;
    rolesDataTable.fetchURL = API_URL + 'api/v1/systems/' + systemId + '/roles';
    rolesDataTable.list();
    displayPermission = false;
  }

  const addRole = () => {
    rolesDataTable.addRow();
  }

  const handleTableAlert = (callback) => { 
    alertMessage = callback.detail;
    console.log(callback.detail)
    setTimeout(() => {
      alertMessage = {
        text: '',
        status: '',
      };
    }, 4300);
  }

  onMount(() => {
    // montar acciones de la tabla
      // ejemplos
    rolesDataTable.addButton.action = () => rolesDataTable.addRow();
    //systemDataTable.addButton.action = () => systemDataTable.goToLink('/users');
    //systemDataTable.addButton.action = () => systemDataTable.goToHref(BASE_URL + 'hola');
    //systemDataTable.addButton.action = () => systemDataTable.openTab(BASE_URL + 'hola');
    // table action buttons
    rolesDataTable.actionButtons = [
      {
        class: 'btn-secondary',
        icon: 'fa-list',
        label: 'Permisos',
        action: (record) => {
          //systemDataTable.askToDeleteRow(record, 'id');
          roleId = record.id;
          permissionsDataTable.fetchURL = API_URL + 'api/v1/systems-permissions/'+ systemId + '/users/' + userId + '/roles/' + record.id;
          permissionsDataTable.saveURL = API_URL + 'api/v1/systems-permissions/'+ systemId + '/users/' + userId;
          permissionsDataTable.list();
          displayPermission = true;
        }
      },
    ];
    permissionsDataTable.addButton.action = () => permissionsDataTable.addRow();
    permissionsDataTable.actionButtons = [];
  });
</script>

{#if alertMessage.text != ''}
  <div class="alert alert-{alertMessage.status}" role="alert">
    {alertMessage.text}
  </div>
{/if}

<div class="row g-2">
  <div class="col-md-6">
    <div class="row subtitle-row">
      <h4 class="subtitle">Lista de Roles</h4>
    </div>
    <DataTable 
      bind:this={rolesDataTable}
      fetchURL={API_URL + 'api/v1/systems/' + systemId + '/roles'}
      saveURL={API_URL + 'api/v1/roles/' + systemId}
      columnKeys={['id', 'name', ]}
      columnTypes={['id', 'td', ]}
      columnNames={['ID', 'Nombre', 'Acciones']}
      columnStyles={['max-width: 50px;', 'max-width: 150px;', 'max-width: 150px;']}
      columnClasses={['d-none', '', 'text-end']}
      messages = {{
        success: 'Datos actualizados', 
        errorNetwork: 'No se pudo listar los roles del sistema. No hay conexión con el servidor.',
        notFound: 'No se pudo listar los roles del sistema. Recurso no encontrado.',
        serverError:'No se pudo listar los roles del sistema. Error interno del servidor',
        requestError: 'No se pudo listar los roles del sistema. No se recibió respuesta del servidor',
        otherError: 'No se pudo listar los roles del sistema. Ocurrió un error no esperado al traer los datos del servidor',
      }}
      addButton={{
        display: false,
        disabled: false,
        action: null
      }}
      saveButton={{
        display: false,
        disabled: false,
        action: null
      }}
      pagination = {{
        display: false,
        step: 10,
        totalPages: 0,
        actualPage: 1
      }}
      actionButtons={[]} 
      on:alert={handleTableAlert} 
      jwtToken={localStorage.getItem('jwtToken')}
    />
  </div>
  <div class="col-md-6 {!displayPermission ? 'd-none' : ''}" style="padding-left: 30px; padding-right: 20px;">
    <div class="row subtitle-row">
      <h4 class="subtitle">Lista de Permisos del Rol</h4>
      <DataTable 
        bind:this={permissionsDataTable}
        fetchURL={API_URL + 'api/v1/roles/' + permissionId + '/permissions'}
        saveURL={API_URL + 'api/v1/api/v1/systems-permissions/'+ systemId + '/users/' + userId}
        columnKeys={['id', 'name', 'registered']}
        columnTypes={['id', 'td', 'radiobuttonAll']}
        columnNames={['ID', 'Nombre', 'Asignado']}
        tdStyles={['', 'padding-bottom: 20px; width: 200px;', 'padding-right: 60px;']}
        columnStyles={['max-width: 50px;', 'max-width: 150px;', 'max-width: 150px;']}
        columnClasses={['d-none', '', 'text-end']}
        messages = {{
          success: 'Datos actualizados', 
          errorNetwork: 'No se pudo listar los permisos del rol. No hay conexión con el servidor.',
          notFound: 'No se pudo listar los permisos del rol. Recurso no encontrado.',
          serverError:'No se pudo listar los permisos del rol. Error interno del servidor',
          requestError: 'No se pudo listar los permisos del rol. No se recibió respuesta del servidor',
          otherError: 'No se pudo listar los permisos del rol. Ocurrió un error no esperado al traer los datos del servidor',
        }}
        saveButton={{
          display: true,
          disabled: false,
          action: null
        }}
        actionButtons={[]} 
        on:alert={handleTableAlert}
        jwtToken={localStorage.getItem('jwtToken')}
      />
    </div>
  </div>
</div>