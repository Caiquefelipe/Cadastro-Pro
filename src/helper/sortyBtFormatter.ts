const sortByFormatter = (column: string, desc: boolean) => {
  return {
    sortyByColumn: column,
    sortyOrder: desc ? 'desc' : 'asc',
  }
}

export { sortByFormatter }
