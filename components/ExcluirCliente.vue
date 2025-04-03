<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  import { type ICliente } from 'src/interfaces/ICliente'

  const props = defineProps({
    cliente: {
      type: Object as () => ICliente,
      required: true,
    },
  })

  const emit = defineEmits(['excluir'])

  const excluir = () => {
    emit('excluir', props.cliente)
  }
</script>

<template>
  <q-btn
    dense
    flat
    color="negative"
    icon="fa-solid fa-trash-alt"
    @click="excluir">
    <q-tooltip>Excluir</q-tooltip>
  </q-btn>
</template>
