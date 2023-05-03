# Golang mock HTTP server

A simple mock server which starts two HTTP servers on to register and de-register endpoints and another to serve the
registered endpoints.

The admin server runs on port `8081`
The mock server runs on port `8080`

The server is intended to be used for testing purposes.

## Usage

```shell
go run server/main.go
```

## Admin endpoints

### Register endpoint

```shell
curl --request POST \
  --url http://localhost:8081/endpoints \
  --header 'Content-Type: application/json' \
  --data '{
	"method": "GET",
	"path": "/temp",
	"resp": {
		"ping": "pong"
	}
}'

```

### De-register endpoint

```shell
curl --request DELETE \
  --url http://localhost:8081/endpoints \
  --header 'Content-Type: application/json' \
  --data '{
	"method": "GET",
	"path": "/temp"
}'
```

### Get registered endpoints

```shell
curl --request GET \
  --url http://localhost:8081/endpoints
```

## Contributing

- [x] Base implementation
- [ ] Add checks to admin endpoints
- [ ] Make status code configurable
- [x] Adding a simple UI
- [ ] Add a `Dockerfile` and `docker-compose.yml` for one command start
- [ ] Add a `Makefile` to start server
- [ ] Save state using a local JSON file