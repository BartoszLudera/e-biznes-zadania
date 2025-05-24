package models

import "gorm.io/gorm"

//cart model
type Cart struct {
	gorm.Model
	UserID   uint      `json:"user_id"`
	User     User      `gorm:"foreignKey:UserID"`
	Products []Product `gorm:"many2many:cart_products;"`
}

func WithUserAndProducts(db *gorm.DB) *gorm.DB {
	return db.Preload("User").Preload("Products")
}
