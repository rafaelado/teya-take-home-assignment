# 🚀 Take Home Teya Assignment

A simple account management service built with [NestJS](https://nestjs.com/).  
This service exposes endpoints for deposits, withdrawals, transfers, and transaction history.

## 📄 Overview

This repository implements a backend service with the following features:

- Account creation
- Deposits and withdrawals
- Transfers between accounts
- Balance checking
- Transaction history per account
- Swagger API documentation

## 📦 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** TypeScript
- **API Docs:** Swagger (available at `http://localhost:3000/docs` after running)
- **API base path:** `http://localhost:3000/api/v1`

## 📄 API Summary

| Method | Endpoint                                    | Summary                  | Request Body  | Response                   |
| ------ | ------------------------------------------- | ------------------------ | ------------- | -------------------------- |
| POST   | `/api/v1/accounts`                          | Create a new account     | None          | `201 Created` – Account    |
| GET    | `/api/v1/accounts/{accountId}`              | Get account information  | None          | `200 OK` – Account         |
| GET    | `/api/v1/accounts/{accountId}/balance`      | Get account balance      | None          | `200 OK` – Balance Object  |
| GET    | `/api/v1/accounts/{accountId}/transactions` | Get account transactions | None          | `200 OK` – Transaction[]   |
| POST   | `/api/v1/accounts/{accountId}/deposit`      | Make a deposit           | DepositDto[]  | `201 Created` – Deposit    |
| POST   | `/api/v1/accounts/{accountId}/withdraw`     | Withdraw money           | WithdrawDto[] | `201 Created` – Withdrawal |
| POST   | `/api/v1/accounts/{accountId}/transfer`     | Transfer money           | TransferDto[] | `201 Created` – Transfer   |

---

## Assumptions

The following assumptions were made to support implementation and interpretation of the API:

- A single user can own multiple accounts.
- Users are allowed to deposit money into their own accounts, effectively **creating money from nothing**.
- Users can withdraw money from their accounts, effectively **removing money from the system**.
- Users can transfer money **between any two accounts**, even if both accounts belong to the same user.
- A `user-id` is added to the **request headers** to simulate authentication and identify the user making the request. IT IS MANDATORY
- The use of `user-id` in headers is a design decision to **avoid deeply nested endpoints** like `/users/:userId/accounts/...`.

## 🚀 Getting Started

### 1. Clone the Repository

Install dependencies

```bash
yarn
```

Start the service

```
yarn start
```

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
