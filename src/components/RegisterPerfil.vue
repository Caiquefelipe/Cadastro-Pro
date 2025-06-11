<script setup lang="ts">
  import { reactive, ref, computed } from 'vue'
  import { type QDialog, useQuasar } from 'quasar'
  import { type ICliente } from 'src/interfaces/ICliente'
  import CFormDialog from './CFormDialog.vue'
  import servicoPerfil from 'src/services/servicoPerfil'
  import { format, isValid, parse, parseISO } from 'date-fns'

  const $q = useQuasar()
  const dialog = ref<QDialog>()
  const isViewMode = ref<boolean>(false)
  const id = ref<number>()
  const cliente = reactive<{ data: ICliente }>({
    data: {} as ICliente,
  })
  console.log(cliente)
  async function criarCliente() {
    await servicoPerfil
      .adicionarCliente(cliente.data)

      .then(() => {
        emit('cliente-salvo', cliente.data)
        dialog.value?.hide()
        $q.notify({
          type: 'positive',
          message: 'Cliente cadastrado com sucesso',
        })
      })
      .catch((e) => {
        $q.notify({
          type: 'negative',
          message: e.response?.data?.data?.message ?? 'Erro ao cadastrar cliente',
        })
      })
  }

  async function editarCiente() {
    await servicoPerfil
      .editarCliente(cliente.data)
      .then(() => {
        emit('cliente-salvo', cliente.data)
        dialog.value?.hide()

        $q.notify({
          type: 'positive',
          message: 'Cliente editado com sucesso',
        })
      })
      .catch((e) => {
        $q.notify({
          type: 'negative',
          message: e.response?.data?.data?.message ?? 'Erro ao editar cliente',
        })
      })
  }

  const emit = defineEmits(['cliente-salvo'])
  async function submitForm() {
    console.log('ID do cliente para salvar:', cliente.data.id)

    if (cliente.data.nascimento) {
      try {
        const parsed = parse(cliente.data.nascimento, 'dd/MM/yyyy', new Date())
        if (isValid(parsed)) {
          cliente.data.nascimento = format(parsed, 'dd/MM/yyyy')
        }
      } catch (error) {
        console.warn('Data de nascimento inválida ou não pôde ser formatada:', error)
      }
    }

    if (cliente.data.id) {
      editarCiente()
    } else {
      criarCliente()
    }
  }

  const titleForm = computed(() => {
    if (id.value) {
      if (isViewMode.value) {
        return 'Visualizar Cliente'
      }
      return 'Editar Cliente'
    } else {
      return 'Cadastrar Cliente'
    }
  })

  function onCancelar() {
    dialog.value?.hide()
  }

  async function show(itemId?: number, perfilViewMode?: boolean) {
    isViewMode.value = perfilViewMode ?? false
    id.value = itemId

    if (id.value) {
      await servicoPerfil
        .pegarClientePorId(id.value)
        .then((res) => {
          cliente.data = {
            ...res,
            nascimento: res.nascimento ? format(parseISO(res.nascimento), 'dd/MM/yyyy') : '',
          } as ICliente
        })
        .catch(() => {
          $q.notify({
            type: 'negative',
            message: 'Erro ao carregar cliente',
          })
        })
      dialog.value?.show()
    } else {
      dialog.value?.show()
      cliente.data = {} as ICliente
    }
  }

  defineExpose({ show })
</script>

<template>
  <CFormDialog
    ref="dialog"
    :title="titleForm"
    :persistent="true">
    <q-form
      @submit="submitForm"
      ref="form"
      aria-labelledby="form.title">
      <q-card>
        <q-card-section
          style="max-height: 60vh"
          class="scroll">
          <div class="row q-col-gutter-md">
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.data.nome"
                label="Nome"
                :dense="false"
                autofocus
                outlined
                :disable="isViewMode"
                lazy-rules
                :rules="[(val) => !!val || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.data.telefone"
                label="Telefone"
                :dense="false"
                :disable="isViewMode"
                mask="(##) #####-####"
                outlined
                :rules="[
                  (val: string): string | boolean => val.length >= 14 || 'Telefone inválido',
                ]" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.data.nascimento"
                label="Nascimento"
                :mask="'##/##/####'"
                :disable="isViewMode"
                :rules="[
                  (vall) => !!vall || 'Campo obrigatório!',
                  (vall) => {
                    const analisado = parse(vall, 'dd/MM/yyyy', new Date())
                    return isValid(analisado) || 'data invalida'
                  },
                ]"
                :dense="false"
                outlined>
                <template v-slot:append>
                  <q-icon
                    name="event"
                    class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale">
                      <q-date
                        v-model="cliente.data.nascimento"
                        mask="DD/MM/YYYY">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            :disable="isViewMode"
                            label="Fechar"
                            color="primary"
                            flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.data.cep"
                label="CEP"
                :dense="false"
                outlined
                :disable="isViewMode"
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.data.endereco"
                :disable="isViewMode"
                label="Endereço"
                :dense="false"
                outlined
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.data.numeroEndereco"
                label="Número"
                :disable="isViewMode"
                :dense="false"
                outlined
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.data.bairro"
                label="Bairro"
                :dense="false"
                :disable="isViewMode"
                outlined
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.data.cidade"
                label="Cidade"
                :disable="isViewMode"
                :dense="false"
                outlined
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-12">
              <q-input
                v-model="cliente.data.estado"
                label="Estado"
                :dense="false"
                :disable="isViewMode"
                outlined
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-12">
              <q-input
                :disable="isViewMode"
                type="textarea"
                label="Descrição"
                v-model="cliente.data.descricao"
                outlined />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <pre> {{ JSON.stringify(cliente, null, 2) }} </pre>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            unelevated
            color="grey"
            style="width: 100px"
            :disable="isViewMode"
            class="gt-xs"
            label="Cancelar"
            @click="onCancelar" />
          <q-btn
            unelevated
            color="primary"
            style="width: 100px"
            class="gt-xs"
            :disable="isViewMode"
            label="Salvar"
            type="submit" />
        </q-card-actions>
      </q-card>
    </q-form>
  </CFormDialog>
</template>
