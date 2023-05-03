package main

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/labstack/echo/v4"
)

type endpoint struct {
	Method string                 `json:"method"`
	Path   string                 `json:"path"`
	Resp   map[string]interface{} `json:"resp"`
}

type server struct {
	endpoints   []endpoint
	adminServer *echo.Echo
	mockServer  *echo.Echo
	mux         sync.Mutex
}

func (s *server) addEndpoint(method string, path string, resp map[string]interface{}) {
	s.mux.Lock()
	defer s.mux.Unlock()
	s.endpoints = append(s.endpoints, endpoint{method, path, resp})
	s.mockServer.Add(method, path, func(c echo.Context) error {
		return c.JSON(http.StatusOK, resp)
	})
	fmt.Printf("Added endpoint: %s %s\n", method, path)
}

func (s *server) removeEndpoint(method string, path string) {
	s.mux.Lock()
	defer s.mux.Unlock()
	for i, e := range s.endpoints {
		if e.Method == method && e.Path == path {
			s.endpoints = append(s.endpoints[:i], s.endpoints[i+1:]...)
			s.mockServer.Add(method, path, func(c echo.Context) error {
				return c.JSON(http.StatusNotFound, map[string]string{"message": "Not Found"})
			})
			fmt.Printf("Removed endpoint: %s %s\n", method, path)
			return
		}
	}
	fmt.Printf("Endpoint not found: %s %s\n", method, path)
}

func (s *server) getEndpoints() []endpoint {
	s.mux.Lock()
	defer s.mux.Unlock()
	return s.endpoints
}

func main() {
	s := &server{
		endpoints:   []endpoint{},
		adminServer: echo.New(),
		mockServer:  echo.New(),
	}

	// Start the server for registering/de-registering endpoints
	go func() {
		if err := s.adminServer.Start(":8081"); err != nil {
			s.adminServer.Logger.Fatal(err.Error())
		}
	}()

	// Register some initial endpoints on the main Echo server
	s.mockServer.GET("/hello", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, world!")
	})
	s.mockServer.POST("/echo", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, you posted something!")
	})

	// Register the endpoint registration/de-registration endpoints
	s.adminServer.POST("/endpoints", func(c echo.Context) error {
		req := struct {
			Method string                 `json:"method"`
			Path   string                 `json:"path"`
			Resp   map[string]interface{} `json:"resp"`
		}{}
		if err := c.Bind(&req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		s.addEndpoint(req.Method, req.Path, req.Resp)
		return c.JSON(http.StatusOK, map[string]string{"message": "Endpoint registered."})
	})
	s.adminServer.DELETE("/endpoints", func(c echo.Context) error {
		req := struct {
			Method string `json:"method"`
			Path   string `json:"path"`
		}{}
		if err := c.Bind(&req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		s.removeEndpoint(req.Method, req.Path)
		return c.JSON(http.StatusOK, map[string]string{"message": "Endpoint deregistered."})
	})
	s.adminServer.GET("/endpoints", func(c echo.Context) error {
		endpoints := s.getEndpoints()
		return c.JSON(http.StatusOK, endpoints)
	})

	// Start the main Echo server
	if err := s.mockServer.Start(":8080"); err != nil {
		s.mockServer.Logger.Fatal(err.Error())
	}
}
