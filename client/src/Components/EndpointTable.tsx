import { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react'

type Endpoint = {
  method: string
  path: string
  resp: Record<string, unknown>
}

const EndpointsTable = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])

  const handleDelete = async (method: string, path: string) => {
    const res = await fetch('http://localhost:8081/endpoints', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, path }),
    })
    if (res.ok) {
      console.log('Endpoint deleted successfully!')
      setEndpoints(endpoints.filter((e) => e.method !== method || e.path !== path))
    } else {
      console.error('Failed to delete endpoint.')
    }
  }

  const fetchData = async () => {
    const res = await fetch('http://localhost:8081/endpoints')
    const data = await res.json()
    setEndpoints(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>HTTP Method</Th>
          <Th>Endpoint Path</Th>
          <Th>Expected Response</Th>
          <Th>
            <Button onClick={() => fetchData()} colorScheme="gray" variant="ghost">
              ↻
            </Button>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {endpoints.map((endpoint, index) => (
          <Tr key={index}>
            <Td>{endpoint.method}</Td>
            <Td>{endpoint.path}</Td>
            <Td>{JSON.stringify(endpoint.resp)}</Td>
            <Td>
              <Button onClick={() => handleDelete(endpoint.method, endpoint.path)} colorScheme="red">
                Delete
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default EndpointsTable
