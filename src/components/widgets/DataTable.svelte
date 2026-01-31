<svelte:options accessors={true} />
<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import axios from 'axios';
  import { Modal } from 'bootstrap';
  import { navigate } from 'svelte-routing';
  import random from '../../helpers/random.js';
  import toDatetimeLocalWithSeconds from '../../helpers/datetime.js';

  export let recordId = 'id';
  export let observer = { new: [], edit: [], delete: []};
  export let fetchURL = null;
  export let saveURL = fetchURL;
  export let deleteURL = fetchURL;
  export let data = [];
  export let columnKeys = [];
  export let columnTypes = [];
  export let columnNames = [];
  export let columnClasses = [];
  export let columnStyles = [];
  export let tdStyles = [];
  export let addButton = {
    display: false,
    disabled: false,
    action: () => {},
  };
  export let saveButton = {
    display: false,
    disabled: false,
    action: () => {},
  };
  export let extraData = {}
  let extraReplace = [];
  export let actionButtons = [];
  export let pagination = {
    display: false,
    step: 10,
    totalPages: 0,
    actualPage: 0
  };
  export let queryParams = {}
  export let messages = {
    success: 'Datos actualizados', 
    errorNetwork: 'No hay conexión con el servidor',
    notFound: 'Recurso no encontrado',
    serverError:'Error interno del servidor',
    requestError: 'No se recibió respuesta del servidor',
    otherError: 'Ocurrió un error no esperado al traer los datos del servidor',
  };
  export let jwtToken = null;

  // delete confirmation modal
  let deleteConfirmationInstance;
  let deleteConfirmationModal;
  let messageConfirmationModal = {
    text: '',
    status: ''
  };
  let idForDeleting = null;
  let btnDisabledDeleteConfirmation = false;
  // dispatch
  const dispatch = createEventDispatcher();

  onMount(() => {
    // list();
    deleteConfirmationInstance = new Modal(deleteConfirmationModal);
    //console.log(addButton)
    //console.log(pagination)
  });

  export const askToDeleteRow = (record, key) => {
    idForDeleting = record[key];
    deleteConfirmationInstance.show();
  }

  const cleanMessage = () => {
    setTimeout(() => {
      messageConfirmationModal = {
        text: '',
        status: ''
      };
      btnDisabledDeleteConfirmation = false;
      deleteConfirmationInstance.hide();
    }, 4300);
  }

  export const deleteRowFromDB = () => {
    btnDisabledDeleteConfirmation = true;
    if(deleteURL && idForDeleting){
      axios.delete( // url, data, headers
        deleteURL + '/' + idForDeleting, 
        {
          // params: queryParams,
          headers:{
            'Authorization': `Bearer ${jwtToken}`
          }
        },
      )
      .then((response) => {
        console.log(response);
        data = data.filter(item => item.id !== idForDeleting);
        messageConfirmationModal.text = response.data.message ? response.data.message : 'Registro borrado correctamente';
        messageConfirmationModal.status = 'success';
        cleanMessage();
      })
      .catch((error) => {
        messageConfirmationModal.text = error.message ? error.message : 'Registro borrado correctamente';;
        messageConfirmationModal.status = 'danger';
        console.error(error);
        cleanMessage();
      })
      .then(() => {
        
      });
    }else{
      console.error('No hay URL para eliminar datos o id a eliminar');
    }
  }

  export const addRow = () => {
    let tmp = {}
    for(const key in columnKeys){
      if(columnKeys[key] == 'id' || columnKeys[key]=='_id'){
        tmp[columnKeys[key]] = `tmp_${random(10)}`;;
      }else{
        tmp[columnKeys[key]] = '';
      }
    }
    data.push(tmp)
    data = data
  }

  export const deleteRow = (record, keyId) => {
    let idToRemove = record[keyId];
    // remove from observers new and edit y agregarlo a delete
    if(observer.new.includes(idToRemove)){
      observer.new = observer.new.filter(u => u !== idToRemove);
    }
    if(observer.edit.includes(idToRemove)){
      observer.edit = observer.edit.filter(u => u !== idToRemove);
    }
    if(!observer.delete.includes(idToRemove) && !idToRemove.toString().includes('tmp')){ // only if no new (tmp_....)
      observer.delete.push(idToRemove)
    }
    // remove from data
    data = data.filter(item => item[keyId] !== idToRemove);
  }

  const inputTextKeyDown = (event) => {
    //console.log(event.target)
    var rowKey = event.target.parentElement.parentElement.firstChild.innerHTML;
    //console.log(rowKey)
    if(String(rowKey).includes('tmp')){
      if(!observer.new.includes(rowKey)){
        observer.new.push(rowKey)
      }
    }else{
      if(!observer.edit.includes(rowKey)){
        observer.edit.push(rowKey)
      }
    }
    //console.log(observer)
  };

  const radioClicked = (event, record, key, newValue) => {
    record[key] = newValue;
    var rowKey = event.target.parentElement.parentElement.firstChild.innerHTML;
    if(String(rowKey).includes('tmp')){
      if(!observer.new.includes(rowKey)){
        observer.new.push(rowKey)
      }
    }else{
      if(!observer.edit.includes(rowKey)){
        observer.edit.push(rowKey)
      }
    }
  };

  const radioThClicked = (event, key) => {
    const isChecked = event.target.checked;
    //console.log(isChecked);
    //console.log(key);
    data.forEach((record) => {
      record[key] = isChecked;
      let rowKey = record[recordId]
      if(isChecked){
        if(!observer.edit.includes(rowKey)){
          observer.edit.push(rowKey)
        }
      }else{
        if(!observer.edit.includes(rowKey)){
          observer.edit.push(rowKey)
        }
      }
    });
    data = data;
  };

  const dataSearch = (key, idSearched) => {
    for (var i=0; i < data.length; i++) {
      if (data[i][key] == idSearched) {
        return data[i];
      }
    }
  }

  const saveChanges = (event) => {
    console.log(observer);
    console.log(data);
    var dataToSend = {new:[], edit:[], delete:[]};
    // search in observers what data will send
    observer.new.forEach((id) => {
      dataToSend.new.push(data.find(record => record[recordId] == id));
    });
    observer.edit.forEach((id) => {
      dataToSend.edit.push(data.find(record => record[recordId] == id));
    });
    observer.delete.forEach((id) => {
      dataToSend.delete.push(id);
    });
    // send 
    if(dataToSend.new.length == 0 && dataToSend.edit.length == 0 && dataToSend.delete.length == 0){
      dispatch('alert', { 
        text: 'No se han registrados cambios',
        status: 'warning'
      });
    }else{
      // console.log(dataToSend)
      axios.post(saveURL, {
          news: dataToSend.new,
          edits: dataToSend.edit,
          deletes: dataToSend.delete,
          extra: extraData,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          }
        })
        .then(function (response) {
          // console.log(extraReplace)
          response.data.forEach(created => {
            /*if(extraReplace.length != 0){
              extraReplace.forEach(value => {
                dataSearch(recordId, created.tmp)[value] = created[value];
              })
            }*/
            const newId = created[recordId];
            const parsedValue = /^\d+$/.test(newId) ? parseInt(newId, 10) : newId;
            dataSearch(recordId, created.tmp)[recordId] = parsedValue;
          });
          data = data;
          observer = { new: [], edit: [], delete: []};
          observer = observer;
          dispatch('alert', { 
            text: messages.success,
            status: 'success'
          });
        })
        .catch(function (error) {
          console.error(error);
          if (error.response) {
            if(error.status == 404){
              dispatch('alert', { 
                text: error.response.data.message,
                status: 'danger'
              });
            }else if(error.status == 501){
              dispatch('alert', { 
                text: error.response.data.message,
                status: 'danger'
              });
            }else{
              dispatch('alert', { 
                text: error.response.data.message,
                status: 'danger'
              });
            }
            console.log(error.response.data);
            console.log(error.status);
            // console.log(error.response.headers);
          }
        }
      );
    }
  };

  export const goToLink = (href) => {
    navigate(href)
  }

  export const goToHref = (href) => {
    window.location.href = href;
  }

  export const openTab = (href) => {
    window.open(href, '_blank');
  }

  const firstPage = () => {
    pagination.actualPage = 1;
    list();
  }

  const previousPage = () => {
    pagination.actualPage = pagination.actualPage - 1;
    list();
  }

  const nextPage = () => {
    pagination.actualPage = pagination.actualPage + 1;
    list();
  }

  const lastPage = () => {
    pagination.actualPage = pagination.totalPages;
    list();
  }

  const handleStepChange = (event) => {
    pagination.step = +event.target.value;
    pagination.actualPage = 1;
    pagination.offset = 0;
    list();
  }

  export const list = () => {
    // if pagation, add query params
    if(pagination.display){
      queryParams.step = pagination.step;
      queryParams.page = pagination.actualPage;
    }
    if(fetchURL){
      axios.get( // url, data, headers
        fetchURL, 
        {
          params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
          headers:{
            'Authorization': `Bearer ${jwtToken}`
          }
        },
      )
      .then(function (response) {
        data = [];
        if(pagination.display){
          data = response.data.list;
          pagination.totalPages = response.data.pages;
          pagination.offset = response.data.offset + 1;
          pagination.total = response.data.total;
          pagination.limit = pagination.offset + pagination.step - 1 > pagination.total ? pagination.total : pagination.offset + pagination.step - 1; 
        }else{
          data = response.data;
        }
      })
      .catch(function (error) {
        console.error(error);
        if(error.code == "ERR_NETWORK"){
          dispatch('alert', { 
            text: messages.errorNetwork,
            status: 'danger'
          });
        }else if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          const status = error.response.status;
          switch (status) {
            case 404:
              dispatch('alert', {
                text: messages.notFound,
                status: 'warning'
              });
              break;
            case 500:
              dispatch('alert', {
                text: messages.serverError,
                status: 'danger'
              });
              break;
            default:
              dispatch('alert', {
                text: `Error HTTP: ${status}`,
                status: 'danger'
              });
              break;
          }
        } else if (error.request) {
          // La solicitud fue hecha pero no hubo respuesta
          dispatch('alert', {
            text: messages.requestError,
            status: 'danger'
          });
        } else {
          // Otro tipo de error
          dispatch('alert', {
            text: messages.otherError,
            status: 'danger'
          });
        }
      })
      .then(function () {
        // TODO
      });
    }else{
      console.error('No hay URL para traer datos');
    }
  };
</script>

<style>
  .table-controls > .btn{
    margin-left: 10px;
  }

  .page-link{
    border-radius: 0px !important;
  }

  .page-item{
    margin-left: 0px;
  }

  .text-end > .btn{
    margin-left: 5px;
  }

  .data-td > input[type="text"]{
    border-color: transparent;
    background-color: transparent;
  }

  th > .form-check-input{
    margin-left: 10px;
  }
</style>
<!-- modal -->
<div bind:this={deleteConfirmationModal} class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Confirmación de Eliminación</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        {#if messageConfirmationModal.text != ''}
          <div class="alert alert-{messageConfirmationModal.status}" role="alert">
            {messageConfirmationModal.text}
          </div>
        {/if}
        ¿Seguro que quiere borrar el registro?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" disabled={btnDisabledDeleteConfirmation}>
          <i class="fa fa-times"></i>Cancelar</button>
        <button type="button" class="btn btn-danger" disabled={btnDisabledDeleteConfirmation}
        on:click={deleteRowFromDB}>
          <i class="fa fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  </div>
</div>
<!-- Tabla de resultados -->
<div class="d-flex justify-content-between align-items-center">
  <!-- Parte izquierda: Filtro de filas por página -->
  <div class="d-flex align-items-center me-3">
    {#if pagination.display}
      <label for="rows-per-page" class="form-label mb-0 me-2">Filas por página:</label>
      <select class="form-select" id="rows-per-page" style="width: 120px;" bind:value={pagination.step} on:change={handleStepChange}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    {/if}
  </div>
  <!-- Parte derecha: Botón "Agregar Registro" con ícono de Font Awesome -->
  <div class="d-flex gap-2">
    {#if addButton.display}
      <button
        class="btn btn-primary d-flex align-items-center"
        disabled={addButton.disabled}
        on:click={() => {
          if (typeof addButton.action === 'function') {
            addButton.action();
          } else {
            alert('No se seteado un evento');
          }
        }}>
        <i class="fa fa-plus me-2"></i> Agregar Registro
      </button>
    {/if}
    {#if saveButton.display}
      <button class="btn btn-success d-flex align-items-center" on:click={saveChanges}>
        <i class="fa fa-check me-2"></i> Guardar Cambios
      </button>
    {/if}
  </div>
</div>    
<table class="table table-striped">
  <thead>
    <tr>
      {#each columnNames as key, i}
        {#if columnTypes[i] == 'radiobuttonAll'}
          <th class="{columnClasses[i]}" style="{columnStyles[i]}" scope="col">
            {columnNames[i]} 
            <input
              class="form-check-input form-check-input-all"
              type="checkbox"
              on:change={(event) => radioThClicked(event, columnKeys[i])}
            />
          </th>
        {:else}
          <th class="{columnClasses[i]}" style="{columnStyles[i]}" scope="col">{columnNames[i]}</th>
        {/if}
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data as record}
    <tr>
      {#each columnKeys as key, i}
        <td class="data-td {columnClasses[i]}" style="{tdStyles[i]}">
          {#if columnTypes[i] == 'input[text]'}
            <input type="text" key="{key}" on:keydown={inputTextKeyDown} bind:value={record[key]} />
          {:else if columnTypes[i] == 'td-datetime'}
            {record[key]}
          {:else if columnTypes[i] == 'radiobutton' || columnTypes[i] == 'radiobuttonAll'}
            <input
              class="form-check-input"
              type="checkbox"
              bind:checked={record[key]}
              on:change={(event) => radioClicked(event, record, key, record[key])}
            />
          {:else} <!-- if columnTypes[i] == 'td'} -->
            {record[key]}
          {/if}
        </td>
      {/each}
      {#if actionButtons.length > 0}
        <td class="text-end" styles="">
          {#each actionButtons as button}
            <button class="btn {button.class}" on:click={() => {
              if (typeof button.action === 'function') {
                button.action(record);
              } else {
                alert('No se seteado un evento');
              }
            }}><i class="fa {button.icon}"></i> {button.label}</button>
          {/each}
        </td>
      {/if}
    </tr>
    {/each}
    </tbody>
  {#if pagination.display}
    <tfoot>
      <tr>
        <td colspan="6">
          <div class="d-flex justify-content-between align-items-center">
            <!-- Texto con el rango de filas mostradas (izquierda) -->
            <div class="text-left">
              <span>Página {pagination.actualPage} de {pagination.totalPages} - Mostrando filas {pagination.offset}-{pagination.limit} de {pagination.total}</span>
            </div>
            <!-- Paginación (derecha) -->
            <nav aria-label="Page navigation">
              <ul class="pagination mb-0">
                <!-- Página Primero -->
                <li class="page-item">
                  <button class="page-link {pagination.actualPage === 1 ? 'disabled' : ''}" type="button" tabindex="-1" on:click={firstPage} disabled={pagination.actualPage === 1}>
                    <i class="fa fa-angle-double-left"></i> Primero
                  </button>
                </li>
                <!-- Página Anterior -->
                <li class="page-item">
                  <button class="page-link {pagination.actualPage === 1 ? 'disabled' : ''}" type="button" tabindex="-1" on:click={previousPage} disabled={pagination.actualPage === 1}>
                    <i class="fa fa-angle-left"></i> Anterior
                  </button>
                </li>
                <!-- Página Siguiente -->
                <li class="page-item">
                  <button class="page-link {pagination.actualPage === pagination.totalPages ? 'disabled' : ''}" type="button" on:click={nextPage} disabled={pagination.actualPage === pagination.totalPages}>
                    Siguiente <i class="fa fa-angle-right"></i>
                  </button>
                </li>
                <!-- Página Último -->
                <li class="page-item">
                  <button class="page-link {pagination.actualPage === pagination.totalPages ? 'disabled' : ''}" type="button" on:click={lastPage} disabled={pagination.actualPage === pagination.totalPages}>
                    Último <i class="fa fa-angle-double-right"></i>
                  </button>
                </li>
              </ul>              
            </nav>
          </div>
        </td>
      </tr>
    </tfoot>
  {/if}
</table>