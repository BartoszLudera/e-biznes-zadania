package models

import "gorm.io/gorm"

type Payment struct {
	gorm.Model
	CartID     uint    `json:"cartId"`
	Amount     float64 `json:"amount"`
	CardNumber string  `json:"cardNumber"`
}
