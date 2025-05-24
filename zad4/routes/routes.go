package routes

import (
	"zad4/controller"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func InitRoutes(e *echo.Echo, db *gorm.DB) {
	productController := &controller.ProductController{DB: db}
	userController := &controller.UserController{DB: db}
	cartController := &controller.CartController{DB: db}
	categoryController := &controller.CategoryController{DB: db}

	e.POST("/products", productController.CreateProduct)
	e.GET("/products", productController.GetAllProducts)
	e.GET("/products/:id", productController.GetProductByID)
	e.PUT("/products/:id", productController.UpdateProduct)
	e.DELETE("/products/:id", productController.DeleteProduct)

	e.GET("/users", userController.GetAllUsers)
	e.POST("/users", userController.CreateUser)
	e.GET("/users/:id", userController.GetUser)
	e.PUT("/users/:id", userController.UpdateUser)
	e.DELETE("/users/:id", userController.DeleteUser)

	e.GET("/carts", cartController.GetAllCarts)
	e.POST("/cart", cartController.AddToCart)
	e.GET("/cart/:user_id", cartController.GetCart)
	e.PUT("/cart/:id", cartController.UpdateCart)
	e.DELETE("/cart/:id", cartController.DeleteCart)

	e.POST("/categories", categoryController.CreateCategory)
	e.GET("/categories", categoryController.GetAllCategories)
	e.GET("/categories/:id", categoryController.GetCategoryByID)
	e.PUT("/categories/:id", categoryController.UpdateCategory)
	e.DELETE("/categories/:id", categoryController.DeleteCategory)
}
