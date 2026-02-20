package entity

import "time"

type Payment struct {
	Amount    *string    `json:"amount,omitempty"`
	CreatedAt *time.Time `json:"created_at,omitempty"`
	Id        *string    `json:"id,omitempty"`
	Merchant  *string    `json:"merchant,omitempty"`
	Status    *string    `json:"status,omitempty"`
}

type PaymentSummary struct {
	Completed   *int     `json:"completed,omitempty"`
	Failed      *int     `json:"failed,omitempty"`
	Processing  *int     `json:"processing,omitempty"`
	Total       *int     `json:"total,omitempty"`
	TotalAmount *float32 `json:"total_amount,omitempty"`
}
}