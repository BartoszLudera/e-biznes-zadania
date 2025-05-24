package controller

import (
	"net/http"
	"zad4/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type CategoryController struct {
	DB *gorm.DB
}

func (cc *CategoryController) CreateCategory(c echo.Context) error {
	var category models.Category
	if err := c.Bind(&category); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid data"})
	}

	if err := cc.DB.Create(&category).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while creating category"})
	}

	return c.JSON(http.StatusCreated, category)
}

func (cc *CategoryController) GetAllCategories(c echo.Context) error {
	var categories []models.Category
	if err := cc.DB.Scopes(models.WithProducts).Find(&categories).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while fetching categories"})
	}
	return c.JSON(http.StatusOK, categories)
}

func (cc *CategoryController) GetCategoryByID(c echo.Context) error {
	id := c.Param("id")
	var category models.Category
	if err := cc.DB.First(&category, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Category not found"})
	}
	return c.JSON(http.StatusOK, category)
}

func (cc *CategoryController) UpdateCategory(c echo.Context) error {
	id := c.Param("id")
	var category models.Category
	if err := cc.DB.First(&category, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "Category not found"})
	}
	if err := c.Bind(&category); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Invalid data"})
	}
	cc.DB.Save(&category)
	return c.JSON(http.StatusOK, category)
}

func (cc *CategoryController) DeleteCategory(c echo.Context) error {
	id := c.Param("id")
	var category models.Category
	if err := cc.DB.Delete(&category, id).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Error while deleting category"})
	}
	return c.NoContent(http.StatusNoContent)
}
