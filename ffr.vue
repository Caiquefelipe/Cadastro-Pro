<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { IPaginatedList } from '@/interfaces/IPaginatedList';
  import { IProductGroup } from '@/interfaces/models';
  import ProductService from '@/services/ProductService';
  import NotificationService from '@/services/NotificationService';
  import CDefaultTable from '@/components/Core/CDefaultTable/CDefaultTable.vue';
  import DialogRegisterGroup from './DialogRegisterGroup.vue';
  import { groupColumns } from './GroupsColumns';
  import GroupFilterDrawer from './GroupFilterDrawer.vue';
  import GroupRowsRequestProps from '@/interfaces/models/Params/GroupParams';
  import CBadgeCard from '@/components/Core/CBadgeCard.vue';
  import { DefaultDialogResult, DefaultDialogType, openDialog } from '@/components/Dialogs/DefaultDialog';
  import CPagination from '@/components/Core/CDefaultTable/CPagination.vue';

  const group = ref<IPaginatedList<IProductGroup[]>>();
  const envDev = ref<boolean>(false);
  const dialogRegisterGroup = ref<typeof DialogRegisterGroup>();
  const dialogGroupFilterDrawer = ref<typeof GroupFilterDrawer>();
  const isLoading = ref<boolean>(true);
  const params = ref<GroupRowsRequestProps>({
    page: 1,
    perPage: 10,
    search: undefined,
  });
  const filtersCount = computed<number>(() => {
    const ignoreFiltersForCount = ['page', 'perPage', 'search'];
    const counter = Object.keys(params.value).filter(filter => {
      if (params.value[filter] === null || params.value[filter] === undefined) return;
      return !ignoreFiltersForCount.includes(filter);
    })?.length;

    return counter;
  });

  async function getGroupList() {
    await ProductService.getGroupRows(params.value)
      .then(res => {
        group.value = res ?? [];
      })
      .catch(e => NotificationService.error(e.response?.data?.data?.message ?? 'Erro ao listar grupos de produtos'));
  }

  async function fetchData() {
    await getGroupList();
    isLoading.value = false;
  }

  async function onSuccess() {
    params.value.page = 1;
    params.value.search = undefined;
    await getGroupList();
  }

  async function onFilter(props) {
    params.value.status = props.status;
    params.value.search = undefined;
    params.value.page = 1;
    await getGroupList();
  }

  function onView(groupId: string) {
    dialogRegisterGroup.value?.show(groupId, true);
  }

  function onEdit(row: IProductGroup) {
    dialogRegisterGroup.value?.show(row);
  }

  function onDelete(row: IProductGroup) {
    openDialog({
      title: 'Atenção',
      message: Deseja realmente remover o grupo <strong>${row.name}</strong>?,
      type: DefaultDialogType.YesNo,
      icon: 'fa fa-triangle-exclamation',
      iconColor: 'negative',
    })
      .then(async res => {
        if (res === DefaultDialogResult.Yes) {
          await ProductService.removeGroup(row.id);
          NotificationService.success('Grupo excluído com sucesso');
          await fetchData();
        }
      })
      .catch(e => NotificationService.error(e.response?.data?.data?.message ?? 'Não foi possível excluir o grupo.'));
  }

  onMounted(async () => {
    envDev.value = import.meta.env.VITE_VISIBLE_NAME_VIEW === 'true';
    await fetchData();
  });

  function resetPage(): void {
    params.value.page = 1;
  }

  watch(
    () => params.value.search,
    async () => {
      resetPage();
      await fetchData();
    },
  );

  watch(
    () => params.value.page,
    async () => await fetchData(),
  );

  watch(
    () => params.value.perPage,
    async () => {
      resetPage();
      await fetchData();
    },
  );
</script>

<template>
  <q-page class="q-pa-md">
    <q-card
      flat
      class="transparent">
      <q-card-section class="q-pa-none q-gutter-x-md">
        <q-btn
          class="gt-xs"
          unelevated
          color="grey"
          icon="fa fa-filter"
          label="Filtros"
          @click="dialogGroupFilterDrawer?.show(params)">
          <q-badge
            v-if="filtersCount > 0"
            color="$primary"
            floating>
            {{ filtersCount }}
          </q-badge>
        </q-btn>
        <q-btn
          class="gt-xs"
          unelevated
          color="primary"
          icon="fa fa-plus"
          label="Novo"
          @click="dialogRegisterGroup?.show()" />
      </q-card-section>
      <c-default-table
        :columns="groupColumns"
        title="Grupos de Produtos"
        :rows="group?.data ?? []"
        :disable="isLoading">
        <template #search-input>
          <q-input
            v-model="params.search"
            dense
            outlined
            :bg-color="$q.screen.lt.sm ? 'white' : 'grey-3'"
            class="col-8 col-md-6 q-pl-none"
            placeholder="Buscar"
            debounce="300">
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]">
              <strong>Pesquise por: </strong>Nome
            </q-tooltip>
            <template #append>
              <q-icon name="fa fa-search" />
            </template>
          </q-input>
        </template>
        <template #body-cell-status="{ props }">
          <q-td class="text-center">
            <c-badge-card
              :value="props.value"
              :color="props.value === 'Ativo' ? 'positive' : 'negative'" />
          </q-td>
        </template>
        <template #actions="actionProps">
          <q-btn
            icon="fa fa-eye"
            size="xs"
            color="blue-1"
            flat
            dense
            @click="onView(actionProps?.props?.row?.id?.toString())" />
          <q-btn
            icon="fa fa-edit"
            size="xs"
            color="green-1"
            flat
            dense
            @click="onEdit(actionProps?.props?.row?.id?.toString())" />
          <q-btn
            icon="fa fa-trash"
            size="xs"
            color="negative"
            flat
            dense
            @click="onDelete(actionProps.props.row)" />
        </template>
        <template #pagination>
          <c-pagination
            v-model:page="params.page"
            v-model:per-page="params.perPage"
            :last-page="group?.meta.lastPage ?? 0"
            :disable="isLoading"
            :per-page-options="[5, 10, 15]"
            :total="group?.meta?.total ?? 0" />
        </template>
      </c-default-table>
    </q-card>
  </q-page>
  <q-page-sticky
    class="lt-sm"
    position="bottom-left"
    :offset="[25, 25]">
    <q-btn
      fab
      icon="fa fa-filter"
      color="grey"
      @click="dialogGroupFilterDrawer?.show(params)">
      <q-badge
        v-if="filtersCount > 0"
        color="$primary"
        floating
        fab>
        {{ filtersCount }}
      </q-badge>
    </q-btn>
  </q-page-sticky>
  <q-page-sticky
    class="lt-sm"
    position="bottom-right"
    :offset="[25, 25]">
    <q-btn
      fab
      icon="fa fa-plus"
      color="primary"
      @click="dialogRegisterGroup?.show()" />
  </q-page-sticky>
  <DialogRegisterGroup
    ref="dialogRegisterGroup"
    @on-success="onSuccess" />
  <GroupFilterDrawer
    ref="dialogGroupFilterDrawer"
    @on-filter="onFilter" />
</template>
