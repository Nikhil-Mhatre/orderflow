resource "aws_cloudwatch_event_bus" "orders" {
  name = "${local.name}-orders"
}

resource "aws_sqs_queue" "processing_dlq" {
  name                      = "${local.name}-processing-dlq"
  message_retention_seconds = 1209600
  sqs_managed_sse_enabled   = true
}

resource "aws_sqs_queue" "eventbridge_dlq" {
  name                      = "${local.name}-eventbridge-delivery-dlq"
  message_retention_seconds = 1209600
  sqs_managed_sse_enabled   = true
}

resource "aws_sqs_queue" "processing" {
  name                       = "${local.name}-processing"
  visibility_timeout_seconds = 120
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.processing_dlq.arn
    maxReceiveCount     = 5
  })
}

resource "aws_cloudwatch_event_rule" "order_created" {
  name           = "${local.name}-order-created"
  event_bus_name = aws_cloudwatch_event_bus.orders.name
  description    = "Route OrderCreated events to the worker queue."

  event_pattern = jsonencode({
    source        = ["order-flow.api"]
    "detail-type" = ["OrderCreated"]
  })
}

resource "aws_sqs_queue_policy" "processing" {
  queue_url = aws_sqs_queue.processing.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowEventBridgeSend"
      Effect    = "Allow"
      Principal = { Service = "events.amazonaws.com" }
      Action    = "sqs:SendMessage"
      Resource  = aws_sqs_queue.processing.arn
      Condition = {
        ArnEquals = { "aws:SourceArn" = aws_cloudwatch_event_rule.order_created.arn }
      }
    }]
  })
}

resource "aws_sqs_queue_policy" "eventbridge_dlq" {
  queue_url = aws_sqs_queue.eventbridge_dlq.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowEventBridgeDeliveryFailure"
      Effect    = "Allow"
      Principal = { Service = "events.amazonaws.com" }
      Action    = "sqs:SendMessage"
      Resource  = aws_sqs_queue.eventbridge_dlq.arn
      Condition = {
        ArnEquals = { "aws:SourceArn" = aws_cloudwatch_event_rule.order_created.arn }
      }
    }]
  })
}

resource "aws_cloudwatch_event_target" "processing" {
  rule           = aws_cloudwatch_event_rule.order_created.name
  event_bus_name = aws_cloudwatch_event_bus.orders.name
  target_id      = "order-processing-queue"
  arn            = aws_sqs_queue.processing.arn

  retry_policy {
    maximum_event_age_in_seconds = 3600
    maximum_retry_attempts       = 10
  }

  dead_letter_config {
    arn = aws_sqs_queue.eventbridge_dlq.arn
  }

  depends_on = [
    aws_sqs_queue_policy.processing,
    aws_sqs_queue_policy.eventbridge_dlq
  ]
}

resource "aws_iam_policy" "worker_sqs" {
  name        = "${local.name}-worker-sqs"
  description = "Worker can consume messages only from the Order Flow processing queue."
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:ChangeMessageVisibility",
        "sqs:GetQueueAttributes"
      ]
      Resource = aws_sqs_queue.processing.arn
    }]
  })
}
