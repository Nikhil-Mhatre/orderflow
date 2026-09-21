# Configure AWS CLI region

```bash
aws configure set region us-east-1
```

# Verify AWS identity

```bash
aws sts get-caller-identity
```

# Create Dead Letter Queue

```bash
aws sqs create-queue \
 --queue-name orderflow-orders-dlq
```

# Get DLQ URL

```bash
DLQ_URL=$(aws sqs get-queue-url \
 --queue-name orderflow-orders-dlq \
 --query QueueUrl \
 --output text)

echo "$DLQ_URL"
```

# Get DLQ ARN

```bash
DLQ_ARN=$(aws sqs get-queue-attributes \
  --queue-url "$DLQ_URL" \
 --attribute-names QueueArn \
 --query 'Attributes.QueueArn' \
 --output text)

echo "$DLQ_ARN"
```

# Create main OrderFlow queue

```bash
aws sqs create-queue \
 --queue-name orderflow-orders \
 --attributes '{
"VisibilityTimeout": "30",
"ReceiveMessageWaitTimeSeconds": "20"
}'
```

# Get main queue URL

```bash
QUEUE_URL=$(aws sqs get-queue-url \
 --queue-name orderflow-orders \
 --query QueueUrl \
 --output text)

echo "$QUEUE_URL"
```

# Configure DLQ redrive policy

```bash
aws sqs set-queue-attributes \
 --queue-url "$QUEUE_URL" \
  --attributes '{"RedrivePolicy":"{\"deadLetterTargetArn\":\"'"$DLQ_ARN"'\",\"maxReceiveCount\":\"3\"}"}'
```

# Verify main queue configuration

```bash
aws sqs get-queue-attributes \
 --queue-url "$QUEUE_URL" \
 --attribute-names All
```

# Verify DLQ configuration

```bash
aws sqs get-queue-attributes \
 --queue-url "$DLQ_URL" \
 --attribute-names All
```

# Verify main queue is configured to use the DLQ

```bash
aws sqs list-dead-letter-source-queues \
 --queue-url "$DLQ_URL"
```

# List OrderFlow queues

```bash
aws sqs list-queues \
 --queue-name-prefix orderflow-
```

# Send test message

```bash
aws sqs send-message \
 --queue-url "$QUEUE_URL" \
 --message-body '{"eventType":"Test","message":"OrderFlow AWS SQS test"}'
```

# Receive test message

```bash
aws sqs receive-message \
 --queue-url "$QUEUE_URL" \
 --attribute-names All \
 --message-attribute-names All
```

# List SQS Queue in AWS

```bash
aws sqs list-queues
```

# delete SQS Queue

```bash
aws sqs delete-queue \
  --queue-url "$QUEUE_URL"
```
