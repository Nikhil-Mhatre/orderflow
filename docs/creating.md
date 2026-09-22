# EventBridge and SQS Development Commands

This document contains AWS CLI commands for creating and configuring the local development messaging infrastructure used by OrderFlow.

The intended flow is:

```text
Order API
    |
    | OrderCreated event
    v
EventBridge
    |
    | EventBridge rule
    v
SQS Queue
    |
    v
Order Worker
```

A Dead Letter Queue (DLQ) is also configured so messages that repeatedly fail processing can be isolated.

## Configuration

```bash
export AWS_REGION=us-east-1

# EventBridge
export EVENT_BUS_NAME=orderflow-dev
export EVENT_RULE_NAME=orderflow-order-created
export EVENT_SOURCE=orderflow.order-api
export EVENT_DETAIL_TYPE=OrderCreated

# SQS
export SQS_QUEUE_NAME=orderflow-order-created
export SQS_DLQ_NAME=orderflow-order-created-dlq
```

## Verify AWS credentials

```bash
aws sts get-caller-identity \
  --region "$AWS_REGION"
```

---

# EventBridge

## Create EventBridge event bus

```bash
aws events create-event-bus \
  --name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

## Verify event bus

```bash
aws events describe-event-bus \
  --name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

## Create OrderCreated rule

```bash
aws events put-rule \
  --name "$EVENT_RULE_NAME" \
  --event-bus-name "$EVENT_BUS_NAME" \
  --event-pattern "{\"source\":[\"$EVENT_SOURCE\"],\"detail-type\":[\"$EVENT_DETAIL_TYPE\"]}" \
  --state ENABLED \
  --region "$AWS_REGION"
```

## Verify rule

```bash
aws events describe-rule \
  --name "$EVENT_RULE_NAME" \
  --event-bus-name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

## Verify rule event pattern

```bash
aws events list-rules \
  --event-bus-name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

---

# SQS

## Create Dead Letter Queue

Create the DLQ before creating the main queue.

```bash
aws sqs create-queue \
  --queue-name "$SQS_DLQ_NAME" \
  --region "$AWS_REGION"
```

## Get DLQ URL

```bash
export SQS_DLQ_URL=$(aws sqs get-queue-url \
  --queue-name "$SQS_DLQ_NAME" \
  --region "$AWS_REGION" \
  --query 'QueueUrl' \
  --output text)
```

## Get DLQ ARN

```bash
export SQS_DLQ_ARN=$(aws sqs get-queue-attributes \
  --queue-url "$SQS_DLQ_URL" \
  --attribute-names QueueArn \
  --region "$AWS_REGION" \
  --query 'Attributes.QueueArn' \
  --output text)
```

## Verify DLQ

```bash
echo "$SQS_DLQ_URL"
echo "$SQS_DLQ_ARN"
```

## Create SQS queue

```bash
aws sqs create-queue \
  --queue-name "$SQS_QUEUE_NAME" \
  --attributes "{\"RedrivePolicy\":\"{\\\"deadLetterTargetArn\\\":\\\"$SQS_DLQ_ARN\\\",\\\"maxReceiveCount\\\":\\\"5\\\"}\"}" \
  --region "$AWS_REGION"
```

## Get SQS queue URL

```bash
export SQS_QUEUE_URL=$(aws sqs get-queue-url \
  --queue-name "$SQS_QUEUE_NAME" \
  --region "$AWS_REGION" \
  --query 'QueueUrl' \
  --output text)
```

## Get SQS queue ARN

```bash
export SQS_QUEUE_ARN=$(aws sqs get-queue-attributes \
  --queue-url "$SQS_QUEUE_URL" \
  --attribute-names QueueArn \
  --region "$AWS_REGION" \
  --query 'Attributes.QueueArn' \
  --output text)
```

## Verify SQS queue

```bash
echo "$SQS_QUEUE_URL"
echo "$SQS_QUEUE_ARN"
```

## Verify queue configuration

```bash
aws sqs get-queue-attributes \
  --queue-url "$SQS_QUEUE_URL" \
  --attribute-names All \
  --region "$AWS_REGION"
```

---

# Allow EventBridge to send messages to SQS

EventBridge needs permission to send messages to the SQS queue.

First, get the ARN of the EventBridge rule:

```bash
export EVENT_RULE_ARN=$(aws events describe-rule \
  --name "$EVENT_RULE_NAME" \
  --event-bus-name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION" \
  --query 'Arn' \
  --output text)
```

Verify it:

```bash
echo "$EVENT_RULE_ARN"
```

Create and apply the policy:

```bash
aws sqs set-queue-attributes \
  --queue-url "$SQS_QUEUE_URL" \
  --attributes "{\"Policy\":\"{\\\"Version\\\":\\\"2012-10-17\\\",\\\"Statement\\\":[{\\\"Sid\\\":\\\"AllowEventBridgeToSendMessages\\\",\\\"Effect\\\":\\\"Allow\\\",\\\"Principal\\\":{\\\"Service\\\":\\\"events.amazonaws.com\\\"},\\\"Action\\\":\\\"sqs:SendMessage\\\",\\\"Resource\\\":\\\"$SQS_QUEUE_ARN\\\",\\\"Condition\\\":{\\\"ArnEquals\\\":{\\\"aws:SourceArn\\\":\\\"$EVENT_RULE_ARN\\\"}}}]}\"}" \
  --region "$AWS_REGION"
```

Verify the policy:

```bash
aws sqs get-queue-attributes \
  --queue-url "$SQS_QUEUE_URL" \
  --attribute-names Policy \
  --region "$AWS_REGION"
```

---

# Connect EventBridge to SQS

At this point we have:

```text
EventBridge Rule
       |
       | needs target
       v
      SQS
```

Add the SQS queue as the target:

```bash
aws events put-targets \
  --event-bus-name "$EVENT_BUS_NAME" \
  --rule "$EVENT_RULE_NAME" \
  --targets "Id=OrderCreatedSQS,Arn=$SQS_QUEUE_ARN" \
  --region "$AWS_REGION"
```

## Verify EventBridge target

```bash
aws events list-targets-by-rule \
  --event-bus-name "$EVENT_BUS_NAME" \
  --rule "$EVENT_RULE_NAME" \
  --region "$AWS_REGION"
```

The output should contain the SQS queue ARN as a target.

---

# Test EventBridge → SQS

## Publish a test OrderCreated event

```bash
aws events put-events \
  --region "$AWS_REGION" \
  --entries "[{\"EventBusName\":\"$EVENT_BUS_NAME\",\"Source\":\"$EVENT_SOURCE\",\"DetailType\":\"$EVENT_DETAIL_TYPE\",\"Detail\":\"{\\\"eventType\\\":\\\"OrderCreated\\\",\\\"eventVersion\\\":\\\"1\\\",\\\"orderId\\\":\\\"test-order-001\\\",\\\"timestamp\\\":\\\"2026-09-20T00:00:00.000Z\\\"}\"}]"
```

## Verify publish result

```bash
aws events put-events \
  --region "$AWS_REGION" \
  --entries "[{\"EventBusName\":\"$EVENT_BUS_NAME\",\"Source\":\"$EVENT_SOURCE\",\"DetailType\":\"$EVENT_DETAIL_TYPE\",\"Detail\":\"{\\\"eventType\\\":\\\"OrderCreated\\\",\\\"eventVersion\\\":\\\"1\\\",\\\"orderId\\\":\\\"test-order-002\\\",\\\"timestamp\\\":\\\"2026-09-20T00:00:00.000Z\\\"}\"}]"
```

A successful EventBridge response should contain:

```text
FailedEntryCount: 0
```

---

# Verify messages reached SQS

Receive messages from the queue:

```bash
aws sqs receive-message \
  --queue-url "$SQS_QUEUE_URL" \
  --max-number-of-messages 10 \
  --wait-time-seconds 5 \
  --region "$AWS_REGION"
```

The response should contain the EventBridge-generated SQS message.

The message body will contain the EventBridge event, including:

```text
source
detail-type
detail
```

The `detail` should contain the `OrderCreated` event.

---

# Check queue attributes

```bash
aws sqs get-queue-attributes \
  --queue-url "$SQS_QUEUE_URL" \
  --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesNotVisible \
  --region "$AWS_REGION"
```

---

# Delete EventBridge target

Before deleting the EventBridge rule, remove its SQS target:

```bash
aws events remove-targets \
  --event-bus-name "$EVENT_BUS_NAME" \
  --rule "$EVENT_RULE_NAME" \
  --ids OrderCreatedSQS \
  --region "$AWS_REGION"
```

Verify:

```bash
aws events list-targets-by-rule \
  --event-bus-name "$EVENT_BUS_NAME" \
  --rule "$EVENT_RULE_NAME" \
  --region "$AWS_REGION"
```

---

# Delete EventBridge rule

```bash
aws events delete-rule \
  --name "$EVENT_RULE_NAME" \
  --event-bus-name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

---

# Delete SQS queue

```bash
aws sqs delete-queue \
  --queue-url "$SQS_QUEUE_URL" \
  --region "$AWS_REGION"
```

---

# Delete SQS Dead Letter Queue

```bash
aws sqs delete-queue \
  --queue-url "$SQS_DLQ_URL" \
  --region "$AWS_REGION"
```

---

# Delete EventBridge event bus

```bash
aws events delete-event-bus \
  --name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

---

# Verify cleanup

## EventBridge bus

```bash
aws events describe-event-bus \
  --name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

## EventBridge rule

```bash
aws events describe-rule \
  --name "$EVENT_RULE_NAME" \
  --event-bus-name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

## SQS queue

```bash
aws sqs get-queue-url \
  --queue-name "$SQS_QUEUE_NAME" \
  --region "$AWS_REGION"
```

## SQS DLQ

```bash
aws sqs get-queue-url \
  --queue-name "$SQS_DLQ_NAME" \
  --region "$AWS_REGION"
```

If cleanup was successful, the EventBridge and SQS commands should report that the corresponding resources do not exist.
