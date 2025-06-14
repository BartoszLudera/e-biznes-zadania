package controller

import (
	"net/http"
	"zad5/backend/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type PaymentController struct {
	DB *gorm.DB
}

func (pc *PaymentController) CreatePayment(c echo.Context) error {
	var payment models.Payment
	if err := c.Bind(&payment); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid payment data"})
	}

	var cart models.Cart
	if err := pc.DB.Preload("Products").First(&cart, payment.CartID).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Cart not found"})
	}

	var total float64
	for _, product := range cart.Products {
		total += product.Price
	}
	payment.Amount = total

	if err := pc.DB.Create(&payment).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to save payment"})
	}

	return c.JSON(http.StatusCreated, payment)
}

func (pc *PaymentController) GetAllPayments(c echo.Context) error {
	var payments []models.Payment
	if err := pc.DB.Find(&payments).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to load payments"})
	}
	return c.JSON(http.StatusOK, payments)
}
