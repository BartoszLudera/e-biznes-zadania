package main

import (
	"zad4/config"
	"zad4/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	db := config.InitDB()
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	e := echo.New()
	routes.InitRoutes(e, db)

	e.Logger.Fatal(e.Start(":8080"))
}
