<script setup lang="ts">
  import { useQuasar } from 'quasar'

  import { computed, useSlots } from 'vue'

  import type ColumnsTable from 'src/interfaces/ColumnsTable'
  import { sortByFormatter } from 'src/helper/sortyBtFormatter'

  const $q = useQuasar()
  const slots = useSlots()

  const props = withDefaults(
    defineProps<{
      title?: string
      rows: any[]
      columns: ColumnsTable[]
      loading?: boolean
      class?: string
      style?: any
      useCustomBadge?: boolean
      useTooltip?: boolean
      grid?: boolean
      rowKey?: string | ((row: any) => any)
      hidePagination?: boolean
      titleClass?: string
      loadingLabel?: string
      noDataLabel?: string
      rowsPerPageOptions?: number[]
      selection?: boolean | string
    }>(),
    {
      title: '',
      loading: false,
      class: '',
      style: undefined,
      useCustomBadge: false,
      useTooltip: false,
      grid: false,
      rowKey: 'id',
      hidePagination: true,
      titleClass: 'text-h6',
      loadingLabel: 'Carregando dados...',
      noDataLabel: 'Não há dados para exibição!',
      rowsPerPageOptions: () => [0],
      selection: false,
    }
  )

  const emit = defineEmits(['onSortBy'])

  const sortBy = (rows: readonly any[], sortBy: string, descending: boolean) => {
    const sortByFormatted = sortByFormatter(sortBy, descending)
    emit('onSortBy', sortByFormatted)
    return props.rows
  }

  const bodyCellSlotNames = computed(() => {
    return Object.keys(slots).filter((x) => x.substring(0, 10) === 'body-cell-')
  })
</script>

<template>
  <q-table
    class="default-table"
    :rows-per-page-options="props.rowsPerPageOptions"
    :grid="props.grid ?? $q.screen.xs"
    :title="props.title"
    :title-class="props.titleClass"
    :no-data-label="props.noDataLabel"
    no-results-label="Nenhum resultado encontrado!"
    :columns="props.columns"
    :rows="props.rows"
    :sort-method="sortBy"
    :row-key="props.rowKey"
    binary-state-sort
    :class="props.class"
    :style="props.style"
    :hide-pagination="props.hidePagination"
    :loading="props.loading"
    :loading-label="props.loadingLabel">
    <template
      v-for="slotName in bodyCellSlotNames"
      :key="slotName"
      #[slotName]="bodyCellProps">
      <slot
        :name="slotName"
        :props="bodyCellProps" />
    </template>

    <template #header-cell-checkbox>
      <q-th class="checkbox-spacing">
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]">
          Selecionar todos desta página
        </q-tooltip>
        <slot name="header-cell-checkbox" />
      </q-th>
    </template>

    <template #top-right>
      <slot name="search-input" />
    </template>
    <template #bottom>
      <div class="row justify-end full-width q-gutter-md">
        <slot name="pagination" />
      </div>
    </template>
    <template #body-cell-numberDoc="numberDoc">
      <q-td
        class="ellipses-text"
        :style="props.useTooltip ? 'width: 200px; max-width: 200px' : undefined">
        <q-tooltip
          v-if="props.useTooltip"
          anchor="top left"
          max-width="15rem"
          style="word-wrap: break-word"
          self="bottom left"
          :offset="[-10, 0]">
          {{ numberDoc.value }}
        </q-tooltip>
        {{ numberDoc.value }}
      </q-td>
    </template>
    <template #body-cell-description="description">
      <q-td
        class="ellipses-text"
        :style="props.useTooltip ? 'width: 250px; max-width: 250px' : undefined">
        <q-tooltip
          v-if="props.useTooltip"
          anchor="top left"
          max-width="15rem"
          style="word-wrap: break-word"
          self="bottom left"
          :offset="[-10, 0]">
          {{ description.value }}
        </q-tooltip>
        {{ description.value }}
      </q-td>
    </template>

    <template #body-cell-actions="actions">
      <q-td
        :props="actions"
        class="q-gutter-x-sm">
        <slot
          name="actions"
          :props="actions" />
      </q-td>
    </template>

    <template #item="itemProps">
      <q-card
        flat
        class="q-mb-md full-width">
        <q-card-section
          v-if="$slots.actions"
          class="row justify-end q-py-none">
          <slot
            name="actions"
            :props="itemProps" />
        </q-card-section>
        <q-separator></q-separator>
        <q-list
          dense
          class="q-pt-sm q-pb-md">
          <q-item
            v-for="col in itemProps.cols"
            :key="col.name"
            class="row">
            <q-item-section>
              <template v-if="$slots.items">
                <slot
                  name="items"
                  :props="{ row: itemProps.row, col }" />
              </template>
              <template v-else>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ col.label }}</q-item-label>
                <q-item-label class="text-body2 text-value-wrap">{{ col.value }}</q-item-label>
              </template>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </template>
  </q-table>
  <div
    class="lt-sm"
    style="height: 50px" />
</template>

<style lang="scss">
  .ellipses-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .default-table {
    padding: 0px 12px;
    &__bottom--nodata {
      align-items: center;
      justify-content: center !important;
    }
    tbody td {
      height: 40px;
      .q-btn {
        padding-top: 0px;
        padding-bottom: 0px;
        min-height: 0px;
      }
    }
    thead tr {
      height: 40px;
    }
    tbody .q-icon {
      font-size: 16px !important;
    }
    .q-table__top {
      padding: 12px 0px;
    }
    .q-badge {
      font-size: 11px;
    }
  }
  .text-value-wrap {
    word-wrap: break-word;
  }

  .checkbox-spacing {
    width: 50px;
  }
</style>
