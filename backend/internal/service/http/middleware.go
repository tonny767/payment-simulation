package http

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/durianpay/fullstack-boilerplate/internal/config"
	"github.com/getkin/kin-openapi/openapi3filter"
	"github.com/golang-jwt/jwt/v5"
)


type UserClaims struct {
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

type contextKey string

const userContextKey contextKey = "user"

func JWTAuthMiddleware() openapi3filter.AuthenticationFunc {
	return func(
		ctx context.Context,
		input *openapi3filter.AuthenticationInput,
	) error {

		req := input.RequestValidationInput.Request

		authHeader := req.Header.Get("Authorization")
		if authHeader == "" {
			return errors.New("missing Authorization header")
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			return errors.New("invalid Authorization format")
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
			return config.JwtSecret, nil
		})
		if err != nil {
			return fmt.Errorf("invalid token: %w", err)
		}

		claims, ok := token.Claims.(*UserClaims)
		if !ok || !token.Valid {
			return errors.New("invalid token claims")
		}

		if len(input.Scopes) > 0 {
			roleAllowed := false
			for _, scope := range input.Scopes {
				if scope == claims.Role {
					roleAllowed = true
					break
				}
			}
			if !roleAllowed {
				return errors.New("forbidden: insufficient role")
			}
		}

		newCtx := context.WithValue(req.Context(), userContextKey, claims)
		input.RequestValidationInput.Request = req.WithContext(newCtx)

		return nil
	}
}