<script setup lang="ts">
  import { type ICliente } from 'src/interfaces/ICliente'

  const props = defineProps({
    cliente: {
      type: Object as () => ICliente,
      required: true,
    },
  })

  const emit = defineEmits(['Visualizar'])

  function EditarCliente() {
    emit('Visualizar', props.cliente)
  }
</script>

<template>
  <q-btn
    flat
    color="blue-4"
    dense
    icon="fa-solid fa-eye"
    @click="EditarCliente">
    <q-tooltip>Visualizar</q-tooltip>
  </q-btn>
</template>
