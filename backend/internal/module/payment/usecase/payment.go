package usecase

import (
	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	"github.com/durianpay/fullstack-boilerplate/internal/module/payment/repository"
)

type PaymentUsecase interface {
	GetPaymentList(sort string, status string) ([]entity.Payment, error)
	GetPaymentSummary() (entity.PaymentSummary, error)
}

type Payment struct {
	repo      repository.PaymentRepository
}

func NewPaymentUsecase(repo repository.PaymentRepository) *Payment {
	return &Payment{repo: repo}
}

func (p *Payment) GetPaymentList(sort string, status string) ([]entity.Payment, error) {
	payments, err := p.repo.GetPaymentList(sort, status)
	if err != nil {
		return nil, err
	}
	if len(payments) == 0 {
		return nil, entity.ErrorNotFound("payments not found")
	}
	return payments, nil
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
