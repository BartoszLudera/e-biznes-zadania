package controller

import (
	"net/http"
	"zad5/backend/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

const notFoundMessage string = "cart not found"

type CartController struct {
	DB *gorm.DB
}

func (cc *CartController) AddToCart(c echo.Context) error {
	var cart models.Cart
	if err := c.Bind(&cart); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid cart format"})
	}

	var productIDs []uint
	for _, p := range cart.Products {
		productIDs = append(productIDs, p.ID)
	}

	var products []models.Product
	if err := cc.DB.Find(&products, productIDs).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Products not found"})
	}

	cart.Products = products
	if err := cc.DB.Create(&cart).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Could not create cart"})
	}

	return c.JSON(http.StatusCreated, cart)
}

func (cc *CartController) GetCart(c echo.Context) error {
	id := c.Param("id")
	var cart models.Cart
	if err := cc.DB.Preload("Products").First(&cart, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": notFoundMessage})
	}
	return c.JSON(http.StatusOK, cart)
}

func (cc *CartController) GetAllCarts(c echo.Context) error {
	var carts []models.Cart
	if err := cc.DB.Preload("Products").Find(&carts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while retrieving carts"})
	}
	return c.JSON(http.StatusOK, carts)
}

func (cc *CartController) UpdateCart(c echo.Context) error {
	id := c.Param("id")
	var updatedCart models.Cart
	if err := c.Bind(&updatedCart); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	var existingCart models.Cart
	if err := cc.DB.First(&existingCart, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": notFoundMessage})
	}

	var products []models.Product
	var productIDs []uint
	for _, p := range updatedCart.Products {
		productIDs = append(productIDs, p.ID)
	}
	if err := cc.DB.Find(&products, productIDs).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Products not found"})
	}

	if err := cc.DB.Model(&existingCart).Association("Products").Replace(products); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to update cart products"})
	}

	return c.JSON(http.StatusOK, existingCart)
}

func (cc *CartController) DeleteCart(c echo.Context) error {
	id := c.Param("id")
	var cart models.Cart
	if err := cc.DB.Preload("Products").First(&cart, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": notFoundMessage})
	}

	if err := cc.DB.Select("Products").Delete(&cart).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Failed to delete cart"})
	}

	return c.NoContent(http.StatusNoContent)
}
