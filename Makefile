.PHONY: start-server
start-server:
	@echo "Starting server..."
	@go run server/main.go

.PHONY: start-client
start-client:
	@echo "Starting client..."
	@npm run start --prefix client