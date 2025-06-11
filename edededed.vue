<script setup lang="ts">
  import { ref, computed, reactive } from 'vue'
  import CFormDialog from '@/components/Core/CFormDialog.vue'
  import { QDialog, QForm } from 'quasar'
  import GroupRequest from '@/interfaces/models/Params/GroupRequest'
  import ProductService from '@/services/ProductService'
  import NotificationService from '@/services/NotificationService'
  import enumToArray from '@/helpers/enumToArray'
  import { StatusEnum } from '@/enum/StatusEnum'
  import { useQuasar } from 'quasar'
  import GroupResponse from '@/interfaces/models/Params/GroupResponse'

  const $q = useQuasar()
  const dialog = ref<QDialog>()
  const isViewMode = ref<boolean>(false)
  const form = ref<QForm>()
  const emit = defineEmits<{ (e: 'onSuccess', value: GroupRequest) }>()
  const id = ref<number>()
  const formRequestGroups = reactive<{ data: GroupRequest }>({
    data: {} as GroupRequest,
  })

  async function show(groupProduct: number, GroupViewMode?: boolean): Promise<void> {
    isViewMode.value = GroupViewMode ?? false
    id.value = groupProduct
    if (id.value) {
      await ProductService.getGroupById(id.value).then((res) => {
        formRequestGroups.data = {
          ...res,
          id: id.value,
        } as GroupResponse
      })
    } else {
      formRequestGroups.data = {
        name: '',
        status: 1,
      } as GroupRequest
    }
    dialog.value?.show()
  }

  async function createGroup() {
    await ProductService.createGroup(formRequestGroups.data)
      .then(() => {
        emit('onSuccess', formRequestGroups.data)
        dialog.value?.hide()
        form.value?.resetValidation()
        NotificationService.success('Grupo cadastrado com sucesso')
      })
      .catch((e) =>
        NotificationService.error(e.response?.data?.data?.message ?? 'Erro ao casdastrar o Grupo')
      )
  }

  async function updateGroup() {
    await ProductService.updateGroup(formRequestGroups.data)
      .then(() => {
        dialog.value?.hide()
        form.value?.resetValidation()
        NotificationService.success('Grupo atualizado com sucesso')
        emit('onSuccess', formRequestGroups.data)
      })
      .catch((e) =>
        NotificationService.error(e.response?.data?.data?.message ?? 'Erro ao atualizar o Grupo')
      )
  }

  function onSubmit() {
    if (formRequestGroups.data?.id) {
      updateGroup()
    } else {
      createGroup()
    }
  }

  defineExpose({ show })

  const title = computed<string>(() => {
    if (id.value) {
      if (isViewMode.value) return 'Visualizar Grupo'
      return 'Editar Grupo'
    } else {
      return 'Adicionar Grupo'
    }
  })
</script>

<template>
  <c-form-dialog
    ref="dialog"
    :title="title"
    persistent
    :maximized="$q.screen.lt.sm"
    :no-esc-dismiss="true"
    :no-backdrop-dismiss="true"
    view-id="dialogRegisterGroup">
    <template #content>
      <q-form
        ref="form"
        @submit="onSubmit">
        <q-card-section class="row q-col-gutter-md">
          <div :class="id ? 'col-md-6 col-xs-12' : 'col-xs-12'">
            <label>Nome *</label>
            <q-input
              v-model="formRequestGroups.data.name"
              :rules="[
                (val) => !!val || 'Campo obrigatório',
                (val) => val.length <= 50 || 'O nome do grupo deve ser menor que 50 caracteres',
              ]"
              :readonly="isViewMode"
              :bg-color="isViewMode ? 'grey-12' : 'white'"
              data-cy="input-name-group"
              autofocus
              outlined
              dense />
          </div>
          <div
            v-if="id"
            class="col-md-6 col-xs-12">
            <label>Status *</label>
            <q-select
              v-model="formRequestGroups.data.status"
              :readonly="isViewMode"
              :bg-color="isViewMode ? 'grey-12' : 'white'"
              outlined
              :options="enumToArray(StatusEnum)"
              map-options
              dense
              hide-bottom-space
              emit-value
              :option-label="(item) => item.key"
              :option-value="(item) => item.value" />
          </div>
        </q-card-section>
      </q-form>
    </template>
    <template #actions>
      <q-btn
        v-if="!isViewMode"
        style="width: 100px"
        unelevated
        color="primary"
        label="Salvar"
        @click="form?.submit" />
      <q-btn
        v-if="!$q.screen.lt.sm"
        style="width: 100px"
        unelevated
        color="grey"
        label="Cancelar"
        @click="dialog?.hide" />
    </template>
  </c-form-dialog>
</template>
