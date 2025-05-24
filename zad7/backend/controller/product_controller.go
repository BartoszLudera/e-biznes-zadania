package controller

import (
	"net/http"
	"zad5/backend/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type ProductController struct {
	DB *gorm.DB
}

func (pc *ProductController) CreateProduct(c echo.Context) error {
	var product models.Product
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	if err := pc.DB.Create(&product).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusCreated, product)
}

func (pc *ProductController) GetAllProducts(c echo.Context) error {
	var products []models.Product
	if err := pc.DB.Find(&products).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while fetching products"})
	}
	return c.JSON(http.StatusOK, products)
}

func (pc *ProductController) GetProductByID(c echo.Context) error {
	id := c.Param("id")
	var product models.Product
	if err := pc.DB.First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Product not found"})
	}
	return c.JSON(http.StatusOK, product)
}

func (pc *ProductController) UpdateProduct(c echo.Context) error {
	id := c.Param("id")
	var product models.Product
	if err := pc.DB.First(&product, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Product not found"})
	}
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	if err := pc.DB.Save(&product).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, product)
}

func (pc *ProductController) DeleteProduct(c echo.Context) error {
	id := c.Param("id")
	if err := pc.DB.Delete(&models.Product{}, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.NoContent(http.StatusNoContent)
}
