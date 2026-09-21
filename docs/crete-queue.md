# Docker containter start

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml up --build -d
```

# creating queue manually

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec localstack \
  awslocal sqs create-queue \
  --queue-name orderflow-orders
```

# creating DLQ

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec localstack \
  awslocal sqs create-queue \
  --queue-name orderflow-orders-dlq
```

# Get DLQ ARN

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec localstack \
  awslocal sqs get-queue-attributes \
  --queue-url http://localhost:4566/000000000000/orderflow-orders-dlq \
  --attribute-names QueueArn
```

# Configure the main queue's retry policy

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec localstack \
  awslocal sqs set-queue-attributes \
  --queue-url http://localhost:4566/000000000000/orderflow-orders \
  --attributes '{
    "RedrivePolicy":"{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-south-1:000000000000:orderflow-orders-dlq\",\"maxReceiveCount\":\"3\"}"
  }'
```

# Creating invalid record

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec localstack   awslocal sqs send-message   --queue-url http://localhost:4566/000000000000/orderflow-orders   --message-body '{
    "eventType": "OrderCreated",
    "eventVersion": "1",
    "orderId": "00000000-0000-0000-0000-000000000000",
    "timestamp": "2026-09-18T06:35:00.000Z"
  }'
```

# Creating valid record

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec localstack   awslocal sqs send-message   --queue-url http://localhost:4566/000000000000/orderflow-orders   --message-body '{
    "eventType": "OrderCreated",
    "eventVersion": "1",
    "orderId": "4687fdbe-3db7-42eb-b21b-9c0bf55cb697",
    "timestamp": "2026-09-18T06:35:00.000Z"
  }'
```

# Test the DLQ deliberately

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec localstack \
  awslocal sqs send-message \
  --queue-url http://localhost:4566/000000000000/orderflow-orders \
  --message-body '{
    "eventType": "OrderCreated",
    "eventVersion": "1",
    "orderId": "00000000-0000-0000-0000-000000000000",
    "timestamp": "2026-09-18T10:00:00Z"
  }'
```

# Down the dontainer

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml down
```
