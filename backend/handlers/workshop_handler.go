package handlers

import (
	"net/http"
	"strings"

	"todo-api/database"
	"todo-api/models"

	"github.com/gin-gonic/gin"
)

func currentUserID(c *gin.Context) (uint, bool) {
	value, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak terautentikasi"})
		return 0, false
	}

	userID, ok := value.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak valid"})
		return 0, false
	}

	return userID, true
}

func GetInvoices(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		return
	}

	var invoices []models.Invoice
	if err := database.DB.Preload("Items").Where("user_id = ?", userID).Order("date DESC, id DESC").Find(&invoices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil invoice"})
		return
	}

	c.JSON(http.StatusOK, invoices)
}

func CreateInvoice(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		return
	}

	var invoice models.Invoice
	if err := c.ShouldBindJSON(&invoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format invoice tidak valid"})
		return
	}

	if strings.TrimSpace(invoice.InvoiceNumber) == "" || strings.TrimSpace(invoice.CustomerName) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nomor invoice dan nama pelanggan wajib diisi"})
		return
	}

	invoice.ID = 0
	invoice.UserID = userID
	for index := range invoice.Items {
		invoice.Items[index].ID = 0
		invoice.Items[index].InvoiceID = 0
	}

	if err := database.DB.Create(&invoice).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan invoice"})
		return
	}

	database.DB.Preload("Items").First(&invoice, invoice.ID)
	c.JSON(http.StatusCreated, invoice)
}

func DeleteInvoice(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		return
	}

	var invoice models.Invoice
	if err := database.DB.Where("id = ? AND user_id = ?", c.Param("id"), userID).First(&invoice).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice tidak ditemukan"})
		return
	}

	if err := database.DB.Delete(&invoice).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus invoice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice berhasil dihapus"})
}

type CustomerSummary struct {
	ID           string           `json:"id"`
	Name         string           `json:"name"`
	Phone        string           `json:"phone"`
	VehiclePlate string           `json:"vehiclePlate"`
	VehicleBrand string           `json:"vehicleBrand"`
	VehicleType  string           `json:"vehicleType"`
	TotalVisits  int              `json:"totalVisits"`
	TotalSpent   float64          `json:"totalSpent"`
	LastVisit    string           `json:"lastVisit"`
	Invoices     []models.Invoice `json:"invoices"`
}

func GetCustomers(c *gin.Context) {
	userID, ok := currentUserID(c)
	if !ok {
		return
	}

	var invoices []models.Invoice
	if err := database.DB.Preload("Items").Where("user_id = ?", userID).Order("date DESC, id DESC").Find(&invoices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil customer"})
		return
	}

	customers := make(map[string]*CustomerSummary)
	for _, invoice := range invoices {
		key := strings.ToUpper(invoice.VehiclePlate)
		customer, exists := customers[key]
		if !exists {
			customer = &CustomerSummary{
				ID:           key,
				Name:         invoice.CustomerName,
				Phone:        invoice.CustomerPhone,
				VehiclePlate: invoice.VehiclePlate,
				VehicleBrand: invoice.VehicleBrand,
				VehicleType:  invoice.VehicleType,
				LastVisit:    invoice.Date,
				Invoices:     []models.Invoice{},
			}
			customers[key] = customer
		}

		customer.TotalVisits++
		customer.TotalSpent += invoice.Total
		customer.Invoices = append(customer.Invoices, invoice)
		if invoice.Date > customer.LastVisit {
			customer.LastVisit = invoice.Date
		}
	}

	result := make([]CustomerSummary, 0, len(customers))
	for _, customer := range customers {
		result = append(result, *customer)
	}

	c.JSON(http.StatusOK, result)
}
