<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { type ICliente } from 'src/interfaces/ICliente'
  import { columns } from './PerfilColumnsTable'
  import RegisterPerfil from './RegisterPerfil.vue'
  import CDefaulttable from './CDefaulttable.vue'
  import ExcluirCliente from './ExcluirCliente.vue'
  import VisualizarCliente from './VisualizarCliente.vue'
  import servicoPerfil from 'src/services/servicoPerfil'
  import { useQuasar } from 'quasar'
  import EditarCliente from './EditarCliente.vue'

  const dialog = ref<typeof RegisterPerfil>()
  const rows = ref<ICliente[]>([])
  const $q = useQuasar()

  async function carregarClientes() {
    rows.value = await servicoPerfil.pegarClientes()
  }

  function onEdit(row: ICliente) {
    dialog.value?.show(row)
  }

  function deletarCliente(id: number) {
    servicoPerfil
      .deletarCliente(id)
      .then(() => {
        carregarClientes()
        $q.notify({
          type: 'positive',
          message: 'Cliente deletado com sucesso!',
        })
      })
      .catch((e) => {
        $q.notify({
          type: 'negative',
          message: e.response?.data?.data?.message ?? 'Erro ao deletar cliente',
        })
      })
  }

  function visualizar(id: number) {
    dialog.value?.show(id, true)
  }

  onMounted(async () => {
    await carregarClientes()
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
          row-key="id"
          :columns="columns">
          <template #actions="actionProps">
            <EditarCliente @click="onEdit(actionProps.props.row.id)" />
            <ExcluirCliente @click="deletarCliente(actionProps.props.row.id)" />
            <VisualizarCliente @click="visualizar(actionProps?.props?.row?.id)" />
          </template>
        </CDefaulttable>
      </q-page>
    </q-page-container>

    <RegisterPerfil
      ref="dialog"
      @cliente-salvo="carregarClientes" />
  </q-layout>
</template>
