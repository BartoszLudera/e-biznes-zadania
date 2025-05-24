
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
}

type PaymentRequest struct {
	CustomerName string `json:"customerName"`
	Email        string `json:"email"`
	Address      string `json:"address"`
	CardNumber   string `json:"cardNumber"`
	ExpiryDate   string `json:"expiryDate"`
	CVV          string `json:"cvv"`
	Amount       float64 `json:"amount"`
	Items        []CartItem `json:"items"`
}

type CartItem struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Quantity int     `json:"quantity"`
}

type PaymentResponse struct {
	Success       bool   `json:"success"`
	TransactionID string `json:"transactionId,omitempty"`
	Message       string `json:"message"`
}

// Przykładowe dane produktów
var products = []Product{
	{
		ID:          1,
		Name:        "Laptop",
		Price:       2999.99,
		Description: "Wydajny laptop do pracy i rozrywki",
		Image:       "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
	},
	{
		ID:          2,
		Name:        "Smartphone",
		Price:       1299.99,
		Description: "Nowoczesny smartfon z doskonałym aparatem",
		Image:       "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
	},
	{
		ID:          3,
		Name:        "Słuchawki",
		Price:       299.99,
		Description: "Bezprzewodowe słuchawki z redukcją szumów",
		Image:       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
	},
	{
		ID:          4,
		Name:        "Tablet",
		Price:       899.99,
		Description: "Lekki tablet do codziennego użytku",
		Image:       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop",
	},
	{
		ID:          5,
		Name:        "Smartwatch",
		Price:       599.99,
		Description: "Inteligentny zegarek z monitorowaniem zdrowia",
		Image:       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
	},
	{
		ID:          6,
		Name:        "Kamera",
		Price:       1899.99,
		Description: "Profesjonalna kamera cyfrowa",
		Image:       "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop",
	},
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Symulacja opóźnienia sieciowego
	time.Sleep(500 * time.Millisecond)
	
	json.NewEncoder(w).Encode(products)
	log.Printf("Products endpoint called - returned %d products", len(products))
}

func getProductByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}
	
	for _, product := range products {
		if product.ID == id {
			json.NewEncoder(w).Encode(product)
			log.Printf("Product %d requested", id)
			return
		}
	}
	
	http.Error(w, "Product not found", http.StatusNotFound)
}

func processPayment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	var paymentReq PaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&paymentReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	
	// Podstawowa walidacja
	if paymentReq.CustomerName == "" || paymentReq.Email == "" || 
	   paymentReq.CardNumber == "" || paymentReq.Amount <= 0 {
		response := PaymentResponse{
			Success: false,
			Message: "Nieprawidłowe dane płatności",
		}
		json.NewEncoder(w).Encode(response)
		return
	}
	
	// Symulacja przetwarzania płatności
	time.Sleep(2 * time.Second)
	
	// Symulacja sukcesu (90% szans na sukces)
	if time.Now().UnixNano()%10 > 0 {
		transactionID := fmt.Sprintf("TXN_%d", time.Now().Unix())
		response := PaymentResponse{
			Success:       true,
			TransactionID: transactionID,
			Message:       "Płatność została przetworzona pomyślnie",
		}
		
		log.Printf("Payment processed successfully for %s, amount: %.2f zł, transaction: %s", 
			paymentReq.CustomerName, paymentReq.Amount, transactionID)
		
		json.NewEncoder(w).Encode(response)
	} else {
		response := PaymentResponse{
			Success: false,
			Message: "Płatność została odrzucona przez bank",
		}
		
		log.Printf("Payment failed for %s, amount: %.2f zł", 
			paymentReq.CustomerName, paymentReq.Amount)
		
		json.NewEncoder(w).Encode(response)
	}
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"time":   time.Now().Format(time.RFC3339),
	})
}

func main() {
	r := mux.NewRouter()
	
	// API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/products", getProducts).Methods("GET")
	api.HandleFunc("/products/{id}", getProductByID).Methods("GET")
	api.HandleFunc("/payment", processPayment).Methods("POST")
	api.HandleFunc("/health", healthCheck).Methods("GET")
	
	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173", "http://localhost:3000", "*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		AllowCredentials: true,
	})
	
	handler := c.Handler(r)
	
	port := ":8080"
	log.Printf("Server starting on port %s", port)
	log.Printf("API endpoints:")
	log.Printf("  GET  /api/products")
	log.Printf("  GET  /api/products/{id}")
	log.Printf("  POST /api/payment")
	log.Printf("  GET  /api/health")
	
	log.Fatal(http.ListenAndServe(port, handler))
}
