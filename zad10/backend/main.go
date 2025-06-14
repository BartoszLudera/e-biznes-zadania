package main

import (
	"zad5/backend/config"
	"zad5/backend/models"
	"zad5/backend/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	db := config.InitDB()

	db.AutoMigrate(
		&models.Product{},
		&models.Cart{},
		&models.Payment{},
	)

	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	e := echo.New()
	routes.InitRoutes(e, db)

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "https://zad-10-frontend-dxgtb0gsdrc2avbp.polandcentral-01.azurewebsites.net/"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
	}))

	e.Logger.Fatal(e.Start(":8080"))

}
