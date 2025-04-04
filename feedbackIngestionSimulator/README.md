# Feedback ingestion simulator

This is a simulator for the feedback ingestion process. It simulates the process of receiving feedback from users and storing it in a database. The simulator generates random feedback data and sends it to the feedback ingestion service.

## Requirements

- Node.js >= 20
- npm >= 7

### Environment Variables

This function uses the environment variables defined in the `.env` file. 
The following environment variables are required:

- `API_GATEWAY_HOSTNAME`: The URL of API Gateway. (`https://api-id.execute-api.region.amazonaws.com/stage`)

## Installation

Install the dependencies:

```bash
npm run ci
```

## Usage

This function generates 4 type of data.

* positive - positive feedback  
* neutral - neutral feedback  
* negative - negative feedback  
* mock - random feedback  

To run the simulator, use the following command:

```bash
npm run {mode}
```

replace mode with the type of data above. i.e. `npm run positive` will generate positive feedback data.