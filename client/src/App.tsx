import { Box, Flex, Heading } from '@chakra-ui/react'
import EndpointsTable from './Components/EndpointTable'
import RegisterEndpointForm from './Components/RegisterEndpointForm'

const App = () => {
  return (
    <Flex direction="column" align="center" minHeight="100vh">
      <Heading as="h1" mb={4} mt={8}>Mock HTTP Server</Heading>
      <Box width="100%" px={[4, 8, 16, 32]} py={8}>
        <Heading as="h3" size="md" mb={4}>
          Register an endpoint
        </Heading>
        <RegisterEndpointForm />
        <Box mb={12} />
        <Heading as="h3" size="md" mb={4}>
          Registered endpoints
        </Heading>
        <EndpointsTable />
      </Box>
    </Flex>
  )
}

export default App
