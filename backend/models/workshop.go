package models

import (
	"time"

	"gorm.io/gorm"
)

type Invoice struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
	UserID        uint           `json:"user_id" gorm:"index"`
	InvoiceNumber string         `json:"invoiceNumber"`
	Date          string         `json:"date"`
	CustomerName  string         `json:"customerName"`
	CustomerPhone string         `json:"customerPhone"`
	VehiclePlate  string         `json:"vehiclePlate"`
	VehicleBrand  string         `json:"vehicleBrand"`
	VehicleType   string         `json:"vehicleType"`
	Mechanic      string         `json:"mechanic"`
	Items         []InvoiceItem  `json:"items" gorm:"foreignKey:InvoiceID;constraint:OnDelete:CASCADE"`
	Subtotal      float64        `json:"subtotal"`
	Discount      float64        `json:"discount"`
	Total         float64        `json:"total"`
	PaymentMethod string         `json:"paymentMethod"`
	Notes         string         `json:"notes"`
}

type InvoiceItem struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	InvoiceID uint           `json:"invoiceId" gorm:"index"`
	Type      string         `json:"type"`
	Name      string         `json:"name"`
	Quantity  float64        `json:"quantity"`
	Price     float64        `json:"price"`
	Total     float64        `json:"total"`
}
