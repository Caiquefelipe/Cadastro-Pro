<script setup lang="ts">
  import { reactive, ref, computed } from 'vue'
  import { type QDialog, useQuasar } from 'quasar'
  import { type ICliente } from 'src/interfaces/ICliente'
  import dayjs from 'dayjs'
  import CFormDialog from './CFormDialog.vue'
  import servicoPerfil from 'src/services/servicoPerfil'

  const $q = useQuasar()
  const dialog = ref<QDialog>()
  const isViewMode = ref<boolean>(false)
  const id = ref<string>()
  const cliente = reactive<ICliente>({
    nome: '',
    descricao: '',
    dataNascimento: dayjs().format('DD/MM/YYYY'),
    endereco: '',
    cep: '',
    telefone: '',
    numeroEndereco: '',
    estado: '',
    bairro: '',
    cidade: '',
  } as ICliente)

  function clearForm() {
    cliente.nome = ''
    cliente.descricao = ''
    cliente.dataNascimento = dayjs().format('DD/MM/YYYY')
    cliente.endereco = ''
    cliente.cep = ''
    cliente.telefone = ''
    cliente.numeroEndereco = ''
    cliente.estado = ''
    cliente.bairro = ''
    cliente.cidade = ''
  }
  const emit = defineEmits(['cliente-salvo'])
  const submitForm = () => {
    servicoPerfil.adicionarCliente(cliente)
    emit('cliente-salvo')
    dialog.value?.hide()
    clearForm()

    $q.notify({
      type: 'positive',
      message: 'Cliente Salvo com sucesso',
    })
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

  function show(itemId?: string, perfilViewMode?: boolean) {
    isViewMode.value = perfilViewMode ?? false
    if (itemId) {
      id.value = itemId
      const clienteSalvo = JSON.parse(localStorage.getItem('cliente') || '[]')
      const clienteEncontrado = clienteSalvo.find((c: ICliente) => c.id === id.value)

      if (clienteEncontrado) {
        Object.assign(cliente, clienteEncontrado)
      }
    } else {
      clearForm()
      id.value = ''
    }
    dialog.value?.show()
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
                v-model="cliente.nome"
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
                v-model="cliente.telefone"
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
                v-model="cliente.dataNascimento"
                label="Nascimento"
                :mask="'##/##/####'"
                :disable="isViewMode"
                :rules="[(val) => !!val || 'Campo obrigatório!']"
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
                        v-model="cliente.dataNascimento"
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
                v-model="cliente.cep"
                label="CEP"
                :dense="false"
                outlined
                :disable="isViewMode"
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.endereco"
                :disable="isViewMode"
                label="Endereço"
                :dense="false"
                outlined
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.numeroEndereco"
                label="Número"
                :disable="isViewMode"
                :dense="false"
                outlined
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.bairro"
                label="Bairro"
                :dense="false"
                :disable="isViewMode"
                outlined
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                v-model="cliente.cidade"
                label="Cidade"
                :disable="isViewMode"
                :dense="false"
                outlined
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório!']" />
            </div>
            <div class="col-xs-12 col-sm-12">
              <q-input
                v-model="cliente.estado"
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
                v-model="cliente.descricao"
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
