package config

import (
	"zad4/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if err != nil {
		panic("Fail to connect to the database")
	}

	db.AutoMigrate(&models.Product{}, &models.Cart{}, &models.User{}, &models.Category{})

	return db
}
