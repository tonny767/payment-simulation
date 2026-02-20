package entity

import "time"

type Payment struct {
	Amount    *string    `json:"amount,omitempty"`
	CreatedAt *time.Time `json:"created_at,omitempty"`
	Id        *string    `json:"id,omitempty"`
	Merchant  *string    `json:"merchant,omitempty"`
	Status    *string    `json:"status,omitempty"`
}