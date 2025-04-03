<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { type ICliente } from 'src/interfaces/ICliente'
  import { columns } from './PerfilColumnsTable'
  import RegisterPerfil from './RegisterPerfil.vue'
  import CDefaulttable from './CDefaulttable.vue'
  import EditarCliente from './EditarCliente.vue'
  import ExcluirCliente from './ExcluirCliente.vue'
  import VisualizarCliente from './VisualizarCliente.vue'

  const dialog = ref<typeof RegisterPerfil>()
  const rows = ref<ICliente[]>()
  const params = ref({ sortByColumn: 'id', sortOrder: 'asc' })

  function carregarClientes() {
    const clientes = JSON.parse(localStorage.getItem('cliente') || '[]')
    rows.value = clientes
  }

  function onSortBy(sortBy: Record<string, string>): void {
    params.value.sortByColumn = sortBy.sortByColumn ?? 'defaultColumn'
    params.value.sortOrder = sortBy.sortOrder ?? 'undefined'
  }

  function excluirCliente(row: ICliente) {
    let clientes = JSON.parse(localStorage.getItem('cliente') || '[]')
    clientes = clientes.filter((cliente: ICliente) => cliente.id !== row.id)
    localStorage.setItem('cliente', JSON.stringify(clientes))
    carregarClientes()
  }

  function Editar(row: ICliente) {
    dialog.value?.show(row)
  }

  function visualizar(row: ICliente) {
    dialog.value?.show(row.id, true)
  }

  onMounted(() => {
    carregarClientes()
  })
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-center">Cadastro Pro</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-btn
        unelevated
        color="primary"
        label="Novo Cliente"
        @click="dialog?.show()"
        style="left: 25px; top: 20px; margin-bottom: 7px" />

      <q-page class="q-pa-lg">
        <CDefaulttable
          title="Lista de Clientes"
          :rows="rows ?? []"
          @on-sort-by="onSortBy"
          row-key="id"
          :columns="columns">
          <template #actions="actionProps">
            <EditarCliente
              :cliente="actionProps.props.row.id"
              @editar="Editar" />
            <ExcluirCliente
              :cliente="actionProps.props.row"
              @excluir="excluirCliente" />
            <VisualizarCliente
              :cliente="actionProps.props.row"
              @visualizar="visualizar" />
          </template>
        </CDefaulttable>
      </q-page>
    </q-page-container>

    <RegisterPerfil
      ref="dialog"
      @cliente-salvo="carregarClientes" />
  </q-layout>
</template>
