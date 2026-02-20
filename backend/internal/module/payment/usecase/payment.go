package usecase

import (
	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	"github.com/durianpay/fullstack-boilerplate/internal/module/payment/repository"
)

type PaymentUsecase interface {
	GetPaymentList(filter entity.PaymentFilter) ([]entity.Payment,int, error)
	GetPaymentSummary() (entity.PaymentSummary, error)
}

type Payment struct {
	repo      repository.PaymentRepository
}

func NewPaymentUsecase(repo repository.PaymentRepository) *Payment {
	return &Payment{repo: repo}
}

func (p *Payment) GetPaymentList(filter entity.PaymentFilter) ([]entity.Payment, int, error) {
	payments, total, err := p.repo.GetPaymentList(filter)
	if err != nil {
		return nil, total ,err
	}
	if len(payments) == 0 {
		return nil, total, entity.ErrorNotFound("payments not found")
	}
	return payments, total, nil
}

func (p * Payment) GetPaymentSummary() (entity.PaymentSummary, error) {
	summary, err := p.repo.GetPaymentSummary()
	if err != nil {
		return entity.PaymentSummary{}, err
	}
	if *summary.Total == 0 {
		return entity.PaymentSummary{}, entity.ErrorNotFound("payment summary not found")
	}
	return summary, nil
}
