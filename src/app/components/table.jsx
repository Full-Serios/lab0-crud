'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Pagination } from '@nextui-org/react'
import { useMemo, useState } from 'react'

const getKeyValue = (obj, key) => obj[key]

export default function TableContent ({ columns, data, isLoading }) {
  const [page, setPage] = useState(1)
  const rowsPerPage = 4

  const pages = Math.ceil(data.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return data.slice(start, end)
  }, [page, data])

  return (
    <Table
      aria-label="Example static collection table"
      classNames={{
        wrapper: 'min-h-[222px]'
      }}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader>
          {columns.map((column) => <TableColumn key={column.key}>{column.label}</TableColumn>)}
        </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner label="Cargando la información..." />}
        items={items}
      >
          {(item) =>
            <TableRow key={item?.id || item?.PERSONA_id}>
              {columns.map((column) => (
                <TableCell key={column.key}>{getKeyValue(item, column.key)}</TableCell>
              ))}
            </TableRow>
          }
        </TableBody>
    </Table>
  )
}
