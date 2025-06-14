package routes

import (
	"zad5/backend/controller"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func InitRoutes(e *echo.Echo, db *gorm.DB) {
	productController := &controller.ProductController{DB: db}
	cartController := &controller.CartController{DB: db}
	paymentController := &controller.PaymentController{DB: db}

	e.POST("/products", productController.CreateProduct)
	e.GET("/products", productController.GetAllProducts)
	e.GET("/products/:id", productController.GetProductByID)
	e.PUT("/products/:id", productController.UpdateProduct)
	e.DELETE("/products/:id", productController.DeleteProduct)

	e.GET("/carts", cartController.GetAllCarts)
	e.POST("/cart", cartController.AddToCart)
	e.GET("/cart/:user_id", cartController.GetCart)
	e.PUT("/cart/:id", cartController.UpdateCart)
	e.DELETE("/cart/:id", cartController.DeleteCart)

	e.POST("/payment", paymentController.CreatePayment)
	e.GET("/payments", paymentController.GetAllPayments)
}
