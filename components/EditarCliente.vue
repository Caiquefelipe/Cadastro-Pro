<script setup lang="ts">
  import { type ICliente } from 'src/interfaces/ICliente'

  const props = defineProps({
    cliente: {
      type: Object as () => ICliente,
      required: true,
    },
  })

  const emit = defineEmits(['Editar'])

  function EditarCliente() {
    emit('Editar', props.cliente)
  }
</script>

<template>
  <q-btn
    flat
    color="green-1"
    dense
    icon="fa-solid fa-edit"
    @click="EditarCliente">
    <q-tooltip>Editar</q-tooltip>
  </q-btn>
</template>
