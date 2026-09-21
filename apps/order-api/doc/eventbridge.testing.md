# EventBridge Development Commands

## Configuration

```bash
export AWS_REGION=us-east-1
export EVENT_BUS_NAME=orderflow-dev
export EVENT_RULE_NAME=orderflow-order-created
export EVENT_SOURCE=orderflow.order-api
export EVENT_DETAIL_TYPE=OrderCreated
```

## Verify AWS credentials

```bash
aws sts get-caller-identity --region "$AWS_REGION"
```

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

## Delete rule

```bash
aws events delete-rule \
  --name "$EVENT_RULE_NAME" \
  --event-bus-name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

## Delete event bus

```bash
aws events delete-event-bus \
  --name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

## Verify cleanup

```bash
aws events describe-event-bus \
  --name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```

```bash
aws events describe-rule \
  --name "$EVENT_RULE_NAME" \
  --event-bus-name "$EVENT_BUS_NAME" \
  --region "$AWS_REGION"
```
