package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Product struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type Cart struct {
	Products []Product `json:"products"`
}

type Payment struct {
	Cart       Cart    `json:"cart"`
	TotalPrice float64 `json:"totalPrice"`
}

func main() {
	e := echo.New()

	e.Use(middleware.CORS())

	products := []Product{
		{Name: "Baton", Price: 10.0},
		{Name: "Keyboard", Price: 20.0},
		{Name: "CPU", Price: 30.0},
		{Name: "Laptop", Price: 40.0},
		{Name: "Komputer", Price: 50.0},
	}

	e.GET("/products", func(c echo.Context) error {
		return c.JSON(http.StatusOK, products)
	})

	e.POST("/payment", func(c echo.Context) error {
		var payment Payment
		if err := c.Bind(&payment); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
		}
		return c.JSON(http.StatusOK, map[string]string{"message": "OK"})
	})

	e.Logger.Fatal(e.Start(":1323"))
}
