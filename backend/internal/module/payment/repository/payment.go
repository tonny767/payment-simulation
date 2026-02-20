package repository

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
)

type PaymentRepository interface {
	GetPaymentList(filter entity.PaymentFilter) ([]entity.Payment, int, error)
	GetPaymentSummary() (entity.PaymentSummary, error)
}

type Payment struct {
	db *sql.DB
}

func NewPaymentRepo(db *sql.DB) *Payment {
	return &Payment{db: db}
}

func (r *Payment) GetPaymentList(filter entity.PaymentFilter) ([]entity.Payment, int, error) {
	baseQuery := "FROM payments"
	var args []interface{}
	conds := []string{}

	if filter.Status != "" {
		validStatuses := map[string]bool{
			"completed":  true,
			"processing": true,
			"failed":     true,
		}

		if validStatuses[filter.Status] {
			conds = append(conds, "status = ?")
			args = append(args, filter.Status)
		}
	}

	if len(conds) > 0 {
		baseQuery += " WHERE " + strings.Join(conds, " AND ")
	}

	countQuery := "SELECT COUNT(*) " + baseQuery

	// get count first
	var total int
	err := r.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, entity.WrapError(err, entity.ErrorCodeInternal, "count error")
	}

	// build final query
	query := "SELECT id, amount, merchant, status, created_at " + baseQuery

	if filter.Sort != "" {
		orderClause := parseSortSQL(filter.Sort)
		if orderClause != "" {
			query += " ORDER BY " + orderClause
		}
	}

	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 {
		filter.Limit = 10
	}

	offset := (filter.Page - 1) * filter.Limit
	query += " LIMIT ? OFFSET ?"

	dataArgs := append(args, filter.Limit, offset)

	rows, err := r.db.Query(query, dataArgs...)
	if err != nil {
		return nil, 0, entity.WrapError(err, entity.ErrorCodeInternal, "db error")
	}
	defer rows.Close()

	var payments []entity.Payment
	for rows.Next() {
		var p entity.Payment
		if err := rows.Scan(&p.Id, &p.Amount, &p.Merchant, &p.Status, &p.CreatedAt); err != nil {
			return nil, 0, entity.WrapError(err, entity.ErrorCodeInternal, "db error")
		}
		payments = append(payments, p)
	}

	return payments, total, nil
}

func parseSortSQL(sort string) string {
		if sort == "" {
			return ""
		}
		order := "ASC"
		if strings.HasPrefix(sort, "-") {
			order = "DESC"
			sort = strings.TrimPrefix(sort, "-")
		}
		// Allow only known fields for safety
		switch sort {
			case "amount", "created_at":
				return fmt.Sprintf("%s %s", sort, order)
		}

	return ""
}

func (r *Payment) GetPaymentSummary() (entity.PaymentSummary, error) {
	query := `
		SELECT
			SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
			SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed,
			SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) AS processing,
			COUNT(1) AS total,
			SUM(amount) AS total_amount
		FROM payments
	`
	row := r.db.QueryRow(query)

	var summary entity.PaymentSummary
	if err := row.Scan(&summary.Completed, &summary.Failed, &summary.Processing, &summary.Total, &summary.TotalAmount); err != nil {
		return entity.PaymentSummary{}, entity.WrapError(err, entity.ErrorCodeInternal, "db error")
	}

	return summary, nil
}
