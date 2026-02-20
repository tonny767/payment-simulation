package handler

import (
	"encoding/json"
	"net/http"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	paymentUsecase "github.com/durianpay/fullstack-boilerplate/internal/module/payment/usecase"
	"github.com/durianpay/fullstack-boilerplate/internal/openapigen"
	"github.com/durianpay/fullstack-boilerplate/internal/transport"
)

type PaymentHandler struct {
	paymentUC paymentUsecase.PaymentUsecase
}

func NewPaymentHandler(paymentUC paymentUsecase.PaymentUsecase) *PaymentHandler {
	return &PaymentHandler{
		paymentUC: paymentUC,
	}
}

func (a *PaymentHandler) GetDashboardV1Payments(
	w http.ResponseWriter,
	r *http.Request,
	params openapigen.GetDashboardV1PaymentsParams, // query params are already here
) {
	var sort string
	if params.Sort != nil {
			sort = string(*params.Sort)
	}

	var status string
	if params.Status != nil {
			status = *params.Status
	}

	payments, err := a.paymentUC.GetPaymentList(sort, status)	
	if err != nil {
		transport.WriteError(w, err)
		return
	}

	//convert to openapigen
	var apiPayments []openapigen.Payment
	for _, p := range payments {
		apiPayments = append(apiPayments, openapigen.Payment{
			Id:        p.Id,
			Amount:    p.Amount,
			Merchant:  p.Merchant,
			Status:    p.Status,
			CreatedAt: p.CreatedAt,
		})
	}

	resp := openapigen.PaymentListResponse{
		Payments: &apiPayments,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		transport.WriteAppError(w, entity.ErrorInternal("internal server error"))
		return
	}
}
