# Payment Simulation

This is fulltsack project related Payment using golang as backend and React Vite as frontend

list of tools version of your machine:

```bash
go version go1.25.0 darwin/arm64
node v24.13.1
react v19.2
vite v7
typescript v5
openapi v3
tailwind v4
TanStack for react query
Material-UI for the react ui
Docker
```

To run by using Docker (recommended), follow this:

```bash
brew install docker
brew install docker-compose

in the main root, run and wait:
docker-compose up --build

wait until last messages come from frontend:
payment_frontend  |   VITE v7.x.x  ready in xxx ms

accessible using:
http://localhost:3000/
swagger using:
http://localhost:8080/swagger/index.html
```

Install all related requirements:

```bash
brew install go
brew install node
```

How to run backend server on local:

```bash
./backend
cp env.sample .env

go mod tidy
go mod vendor
go run main.go

# on the first run, you should see:
# seeding users...
# seeding payments...

#IF you are encountering this error running tidy:
go.mod:52: unknown directive: tool
#either you upgrade to Go 1.22+ OR
#remove tool line (line 52) and install it yourself the oapi-codegen

go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest


```

using Makefile:

```bash
./backend
cp env.sample .env

make dep
make gen-secret
make openapi-gen OR
make openapi-run
make run
```

How to run backend server on production build:

```bash
./backend
cp env.sample .env
go mod tidy
go mod vendor
go build -o app
```

using Makefile:

```bash
./backend
cp env.sample .env

make dep
make gen-secret
make openapi-gen OR
make openapi-run
make build
```

How to run frontend on local:

```bash
npm install
npm run dev --host
```

How to run frontend on production build:

```bash
npm install
npm run build
```

To checking openapi documentations, you can visit this url after backend running.

```bash
http://localhost:8080/swagger/index.html
```

Login to frontend by visiting:

```bash
http://localhost:3000/login

cs@test.com
password

operation@test.com
password
```

## Frontend Architecture

- TanStack Query → server state management
- React Context → authentication state
- Protected routes using JWT token
- Material UI for UI components

## Authentication Flow

1. Login → receive JWT
2. Token stored in client state (localStorage.setItem)
3. Token sent via Authorization header
4. Protected routes validated by backend middleware

## Persistence

- SQLite database
- Auto migration + seed on first run
- Payment data stored locally

## Tradeoffs / Design Decisions

## 1. Authentication storage — LocalStorage vs HttpOnly Cookies

JWT is stored in **localStorage** instead of HttpOnly cookies.

**Reason:**

- No CSRF protection setup required
- Faster frontend integration

**Tradeoff:**

- More vulnerable to XSS compared to HttpOnly cookies
- Production systems should prefer secure cookie-based authentication.

---

### 2. State Management — React Context instead of Redux

Authentication and global state are handled using **React Context** rather than Redux or other state libraries.

**Reason:**

- Project scope is small
- Avoids unnecessary boilerplate
- Easier to maintain for simple global state

**Tradeoff:**

- Less scalable than Redux/Zustand for large applications
- Limited debugging and middleware capabilities.

---

### 3. Sorting limitations

Only single-field sorting is supported (`amount`, `created_at`).

**Reason:**

- Keeps backend query logic simple

**Tradeoff:**

- Multi-field sorting not supported.

---

### 4. SQLite instead of Redis / external database

SQLite is used for persistence.

**Reason:**

- Zero setup
- Easy local development
- Persistent storage without extra infrastructure

**Tradeoff:**

- Not suitable for high concurrency or distributed systems.

---

## Testing Scenarios

The application can be validated using the following behaviors:

- **Status filter** correctly filters payments.
- **Pagination after filtering** returns consistent results.
- **Sorting** now only works for: (just click on the label)
  - amount
  - created_at
- **Summary widget consistency**:
  - total counts and amounts reflect current dataset accurately.

see backend [README.md](backend/README.md)
