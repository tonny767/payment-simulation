package main

import (
	"database/sql"
	"log"
	"time"

	"github.com/durianpay/fullstack-boilerplate/internal/api"
	"github.com/durianpay/fullstack-boilerplate/internal/config"
	ah "github.com/durianpay/fullstack-boilerplate/internal/module/auth/handler"
	ar "github.com/durianpay/fullstack-boilerplate/internal/module/auth/repository"
	au "github.com/durianpay/fullstack-boilerplate/internal/module/auth/usecase"
	ph "github.com/durianpay/fullstack-boilerplate/internal/module/payment/handler"
	pr "github.com/durianpay/fullstack-boilerplate/internal/module/payment/repository"
	puc "github.com/durianpay/fullstack-boilerplate/internal/module/payment/usecase"
	srv "github.com/durianpay/fullstack-boilerplate/internal/service/http"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	_ = godotenv.Load()

	db, err := sql.Open("sqlite3", "dashboard.db?_foreign_keys=1")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := initDB(db); err != nil {
		log.Fatal(err)
	}

	JwtExpiredDuration, err := time.ParseDuration(config.JwtExpired)
	if err != nil {
		panic(err)
	}

	userRepo := ar.NewUserRepo(db)
	authUC := au.NewAuthUsecase(userRepo, config.JwtSecret, JwtExpiredDuration)

	authH := ah.NewAuthHandler(authUC)

	paymentRepo := pr.NewPaymentRepo(db)
	paymentUC := puc.NewPaymentUsecase(paymentRepo)

	paymentH := ph.NewPaymentHandler(paymentUC)

	apiHandler := &api.APIHandler{
		Auth: authH,
		Payment: paymentH,
	}

	server := srv.NewServer(apiHandler, config.OpenapiYamlLocation)

	addr := config.HttpAddress
	log.Printf("starting server on %s", addr)
	server.Start(addr)
}

func initDB(db *sql.DB) error {
	// create tables if not exists
	stmts := []string{
		`CREATE TABLE IF NOT EXISTS users (
		  id INTEGER PRIMARY KEY AUTOINCREMENT,
		  email TEXT NOT NULL UNIQUE,
		  password_hash TEXT NOT NULL,
		  role TEXT NOT NULL
		);`,

		`CREATE TABLE IF NOT EXISTS payments (
		  id INTEGER PRIMARY KEY AUTOINCREMENT,
		  amount INTEGER NOT NULL,
		  merchant TEXT,
		  status TEXT NOT NULL,
		  created_at DATETIME NOT NULL
		);`,
	}
	for _, s := range stmts {
		if _, err := db.Exec(s); err != nil {
			return err
		}
	}

	seedUsers(db)
	seedPayments(db)

	const dbLifetime = time.Minute * 5
	db.SetConnMaxLifetime(dbLifetime)
	return nil
}

func seedUsers(db *sql.DB) error {
	var cnt int
	if err := db.QueryRow("SELECT COUNT(1) FROM users").Scan(&cnt); err != nil {
		return err
	}

	if cnt > 0 {
		return nil
	}

	log.Println("Seeding users...")

	hash, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = db.Exec(
		"INSERT INTO users(email, password_hash, role) VALUES (?, ?, ?)",
		"cs@test.com", string(hash), "cs",
	)
	if err != nil {
		return err
	}

	_, err = db.Exec(
		"INSERT INTO users(email, password_hash, role) VALUES (?, ?, ?)",
		"operation@test.com", string(hash), "operation",
	)
	return err
}

func seedPayments(db *sql.DB) error {
	var cnt int
	if err := db.QueryRow("SELECT COUNT(1) FROM payments").Scan(&cnt); err != nil {
		return err
	}

	if cnt > 0 {
		return nil
	}

	log.Println("Seeding payments...")

	now := time.Now()

	merchants := []string{
		"Tokopedia",
		"Shopee",
		"Grab",
		"Gojek",
		"Netflix",
		"Spotify",
		"Steam",
		"Amazon",
	}

	for i := 1; i <= 50; i++ {
		merchant := merchants[i%len(merchants)]
		amount := 10000 + i*5000

		status := "completed"
		if i > 30 {
			status = "processing"

		}
		if i > 40 {
			status = "failed"
		}

		createdAt := now.Add(time.Duration(-i) * time.Hour)

		_, err := db.Exec(`
			INSERT INTO payments (merchant, amount, status, created_at)
			VALUES (?, ?, ?, ?)
		`, merchant, amount, status, createdAt)

		if err != nil {
			return err
		}
	}
	return nil
}

