package controller

import (
	"net/http"
	"zad4/models"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type UserController struct {
	DB *gorm.DB
}

func (uc *UserController) CreateUser(c echo.Context) error {
	var user models.User
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	if err := uc.DB.Create(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusCreated, user)
}

func (uc *UserController) GetUser(c echo.Context) error {
	id := c.Param("id")
	var user models.User
	if err := uc.DB.First(&user, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "User not found"})
	}

	return c.JSON(http.StatusOK, user)
}

func (uc *UserController) GetAllUsers(c echo.Context) error {
	var users []models.User
	if err := uc.DB.Find(&users).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, users)
}

func (uc *UserController) UpdateUser(c echo.Context) error {
	id := c.Param("id")
	var user models.User
	if err := uc.DB.First(&user, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "User not found"})
	}

	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	if err := uc.DB.Save(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, user)
}

func (uc *UserController) DeleteUser(c echo.Context) error {
	id := c.Param("id")
	var user models.User
	if err := uc.DB.First(&user, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "User not found"})
	}

	if err := uc.DB.Delete(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.NoContent(http.StatusNoContent)
}
