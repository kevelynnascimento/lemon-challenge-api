## Lemon challenge API 🍋

This project involves screening potential clients for eligibility to join Lemon. Some clients may not be accepted due to regulatory reasons or because it's not beneficial for either party. Eligibility is determined through checking data from the client's electricity bill. If ineligible, reasons must be clearly stated. If eligible, the projection of CO2 emissions reduction by using clean energy must also be calculated.

**Developed by Kevelyn Nascimento** <a href="https://www.linkedin.com/in/kevelynnascimento" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?&style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>

## Packages

- Node.js (version >=16.14.0)
- CORS (version ^2.8.5)
- dotenv (version ^16.4.1)
- Express.js (version ^4.18.2)
- Inversify (version ^6.0.2)
- inversify-express-utils (version ^6.4.6)
- reflect-metadata (version ^0.2.1)

## Running the Project for the First Time

### Install Dependencies:

```bash
npm install
```

### Configure your .env file:

```
1. If you do not have one, please create a .env file in your root directory.
2. Configure your PORT value as the desired value.
3. It should be like this: PORT=3000.
```

### To start in regular mode:

```bash
npm run start
```

### To start in development mode:

```bash
npm run start
```

### To start in production mode:

```bash
npm run prod
```

## Running tests for the First Time

### Run Tests:

```bash
npm run test
```

### Run Tests in Watch Mode (Dev):

```bash
npm run test:dev
```

### Generate Test Coverage Report:

```bash
npm run test:coverage
```

## Manual testing

### Informations:

```bash
URL: http://localhost:3000/api/eligibility/verification
Method: POST
Payload type: JSON
```

### cURL - Success:

```bash
curl --location 'http://localhost:3000/api/eligibility/verification' \
--header 'Content-Type: application/json' \
--data '{
    "documentNumber": "14041737706",
    "connectionType": "bifasico",
    "consumptionClassification": "comercial",
    "taxModality": "convencional",
    "historyItems": [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160,
        6941,
        4597
    ]
}'
```

### cURL - Failure:

```bash
{
    "documentNumber": "14041737706",
    "connectionType": "bifasico",
    "consumptionClassification": "rural",
    "taxModality": "verde",
    "historyItems": [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160
    ]
}
```

### Example payload - Success:

```json
{
    "documentNumber": "14041737706",
    "connectionType": "bifasico",
    "consumptionClassification": "comercial",
    "taxModality": "convencional",
    "historyItems": [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160,
        6941,
        4597
    ]
}
```

### Example payload - Failure:

```json
{
    "documentNumber": "14041737706",
    "connectionType": "bifasico",
    "consumptionClassification": "rural",
    "taxModality": "verde",
    "historyItems": [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160
    ]
}
```