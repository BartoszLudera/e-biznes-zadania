package controller

import (
	"net/http"
	"zad4/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type CartController struct {
	DB *gorm.DB
}

func (cc *CartController) AddToCart(c echo.Context) error {
	var cart models.Cart

	if err := c.Bind(&cart); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid data"})
	}

	if cart.UserID == 0 {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Missing user_id"})
	}

	if err := cc.DB.Create(&cart).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while creating cart"})
	}

	var updatedCart models.Cart
	if err := cc.DB.Scopes(models.WithUserAndProducts).First(&updatedCart, cart.ID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while loading related data"})
	}

	return c.JSON(http.StatusCreated, updatedCart)
}

func (cc *CartController) GetCart(c echo.Context) error {
	id := c.Param("user_id")
	var cart models.Cart
	if err := cc.DB.Scopes(models.WithUserAndProducts).First(&cart, "user_id = ?", id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Cart not found"})
	}
	return c.JSON(http.StatusOK, cart.Products)
}

func (cc *CartController) GetAllCarts(c echo.Context) error {
	var carts []models.Cart
	if err := cc.DB.Scopes(models.WithUserAndProducts).Find(&carts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while retrieving carts"})
	}

	return c.JSON(http.StatusOK, carts)
}

func (cc *CartController) UpdateCart(c echo.Context) error {
	id := c.Param("id")
	var cart models.Cart
	if err := cc.DB.First(&cart, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Cart not found"})
	}

	if err := c.Bind(&cart); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	if err := cc.DB.Save(&cart).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, cart)
}

func (cc *CartController) DeleteCart(c echo.Context) error {
	id := c.Param("id")
	var cart models.Cart
	if err := cc.DB.First(&cart, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Cart not found"})
	}

	if err := cc.DB.Delete(&cart).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.NoContent(http.StatusNoContent)
}
