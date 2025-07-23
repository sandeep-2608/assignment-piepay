# PiePay Backend - Flipkart Offer Detection API
A Node.js + MongoDB backend service that detects and stores Flipkart payment offers, then calculates the highest available discount for any given payment scenario.

## Quick Start
### 1. Clone and install
```
git clone https://github.com/sandeep-2608/assignment-piepay.git
npm install
```
### 2. Setup MongoDB and environment
  Edit .env with your MongoDB URI

### 3. Start development server
  npm run dev

## API Endpoints
### POST /api/v1/payment-offers/offer
Ingests Flipkart offer API response and stores offers in database.

Request:

    json
    {
      "flipkartOfferApiResponse": {
        "pgOffers": [...]
      }
    }
Response:

    json
    {
      "noOfOffersIdentified": 5,
      "noOfNewOffersCreated": 3
    }

### GET /api/v1/payment-offers/highest-discount
Calculates the highest discount for given payment parameters.

Request:

    text
    GET /api/v1/payment-offers/highest-discount?amountToPay=10000&bankName=AXIS&paymentInstrument=CREDIT
Response:

    json
    {
      "highestDiscountAmount": 1000
    }

## Tech Stack
  Node.js + Express.js
  MongoDB + Mongoose


# Project Structure
    text
    server/
    ├─ config/database.js
    ├─ models/Offer.js
    ├─ routes/offers.js
    ├─ app.js
    └─ package.json
    

## Assumptions made to complete the assignment 
  1. Discount types are limited to PERCENTAGE and FIXED—cashback behaves like fixed for calculations.
  2. All currency values are in Indian Rupees.
  3. Flipkart may change field names; the parser only assumes a top-level pgOffers array

## A brief explanation of your design choices (e.g., why you chose a specific framework, database schema decisions).
  A document store fits best because each offer can embed heterogeneous rules (tiers, exclusions).
     
## A short note on how you would scale the GET /highest-discount endpoint to handle 1,000 requests per second. 

 1. Introduce Caching (Redis):
    Cache the discount computation results based on common queries (bankName, paymentInstrument, amountToPay). Since most traffic will be for repeated parameters (especially during sales), a cache hit ratio of 80–95% is achievable.
    
 2. Optimize Database Indexing:
    Ensure MongoDB compound indexes are set on frequently queried fields, e.g., { bankName, paymentInstruments }. This minimizes query latency for uncached requests.

 3. Connection Pooling:
    Use MongoDB connection pools with an increased pool size to ensure sufficient concurrent query processing.

## A short note on what you will improve if you had more time to complete the assignment.
  1. Input Validation:
     Integrate libraries like joi or express-validator to enforce payload schemas and reject malformed requests early.
  2. Offer Expiry Handling:
     Add background jobs or TTL indexes to purge expired offers automatically, ensuring queries never include outdated discounts.
  3. Automated Test Coverage:
      Write robust unit and integration tests for all endpoints, including edge cases and race conditions.
  4. Admin Dashboard:
     Create a UI to visualize stored offers, monitor ingestion status, and view real-time API metrics.

