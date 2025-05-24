package models

import "gorm.io/gorm"

// Product model
type Product struct {
	gorm.Model
	Name       string   `json:"name"`
	Price      float64  `json:"price"`
	CategoryID uint     `json:"category_id"`
	Category   Category `gorm:"foreignKey:CategoryID"`
}

func WithCategory(db *gorm.DB) *gorm.DB {
	return db.Preload("Category")
}
