<script setup lang="ts">
  import { QDialog } from 'quasar'
  import { ref, defineProps } from 'vue'

  const dialog = ref<QDialog>()

  const props = defineProps<{
    persistent?: boolean

    title?: string
  }>()

  function show() {
    dialog.value?.show()
  }

  function hide() {
    dialog.value?.hide()
  }

  defineExpose({ show, hide })
</script>

<template>
  <q-dialog
    ref="dialog"
    :persistent="props.persistent">
    <q-card>
      <q-card-section class="header row justify-between items-center q-py-none">
        <div class="text-h6">{{ props.title }}</div>
        <q-btn
          flat
          round
          dense
          color="grey"
          icon="fa-solid fa-times"
          @click="hide()" />
      </q-card-section>
      <q-separator />

      <div>
        <slot></slot>
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
  .header {
    position: sticky;
    top: 0px;
    max-height: 52px;
    height: 52px;
    min-height: 52px;
  }
</style>
