import { storeTable } from 'src/helper/StoreTable'
import type ColumnsTable from 'src/interfaces/ColumnsTable'

export const columns = [
  {
    name: 'nome',
    label: 'Nome',
    field: (row) => row.nome,
    align: 'left',
    headerStyle: `${storeTable.headerStyleFirstElement}`,
    sortable: true,
  },
  {
    name: 'descricao',
    label: 'Descrição',
    field: (row) => row.descricao,
    align: `${storeTable.alignContent}`,
    headerStyle: `${storeTable.headerStyleElements}`,

    sortable: true,
  },
  {
    name: 'Telefone',
    label: 'Telefone',
    headerStyle: `${storeTable.headerStyleElements}`,
    field: (row) => row.telefone,
    align: 'left',
    sortable: true,
  },
  {
    name: 'Data de nascimento',
    label: 'Data de nascimento',
    field: (row) => row.dataNascimento,
    headerStyle: `${storeTable.headerStyleElements}`,
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    headerStyle: `${storeTable.headerStyleElements}`,
    algin: 'right',
    label: '',
    field: 'actions',
  },
] as ColumnsTable[]
