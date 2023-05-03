import { useState } from 'react'
import { Button, FormControl, FormLabel, Input, Text, Textarea, VStack } from '@chakra-ui/react'

type Endpoint = {
  method: string
  path: string
  respString: string
  resp?: Record<string, unknown>
}

const RegisterEndpointForm = () => {
  const [endpoint, setEndpoint] = useState<Endpoint>({
    method: '',
    path: '',
    respString: '',
  })
  const [respError, setRespError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      endpoint.resp = JSON.parse(endpoint.respString)
    } catch (error) {
      setRespError('Invalid JSON format for expected response.')
      return
    }

    const res = await fetch('http://localhost:8081/endpoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(endpoint),
    })

    if (res.ok) {
      console.log('Endpoint registered successfully!')
      setEndpoint({ method: '', path: '', respString: '' })
      setRespError(null)
    } else {
      console.error('Failed to register endpoint.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl id="method" isRequired>
          <FormLabel>HTTP Method</FormLabel>
          <Input
            placeholder="GET"
            value={endpoint.method}
            onChange={(e) => setEndpoint({ ...endpoint, method: e.target.value })}
          />
        </FormControl>
        <FormControl id="path" isRequired>
          <FormLabel>Endpoint Path</FormLabel>
          <Input
            placeholder="/temp"
            value={endpoint.path}
            onChange={(e) => setEndpoint({ ...endpoint, path: e.target.value })}
          />
        </FormControl>
        <FormControl id="resp" isInvalid={!!respError} isRequired>
          <FormLabel>Expected Response</FormLabel>
          <Textarea
            placeholder='{"ping": "pong"}'
            value={endpoint.respString}
            onChange={(e) =>
              setEndpoint({
                ...endpoint,
                respString: e.target.value,
              })
            }
          />
          {respError && <Text color="red.500">{respError}</Text>}
        </FormControl>
        <Button type="submit">Register Endpoint</Button>
      </VStack>
    </form>
  )
}

export default RegisterEndpointForm
