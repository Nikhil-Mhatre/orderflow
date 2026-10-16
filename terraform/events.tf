resource "aws_cloudwatch_event_bus" "app" {
  name = "${local.name}-events"
  kms_key_identifier = aws_kms_key.app.arn
}
resource "aws_sqs_queue" "dlq" {
  name = "${local.name}-events-dlq"
  message_retention_seconds = 1209600
  kms_master_key_id = aws_kms_key.app.arn
}
resource "aws_sqs_queue" "events" {
  name = "${local.name}-events"
  visibility_timeout_seconds = 60
  message_retention_seconds = 345600
  receive_wait_time_seconds = 20
  kms_master_key_id = aws_kms_key.app.arn
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount = 5
  })
}
resource "aws_cloudwatch_event_rule" "orders" {
  name = "${local.name}-order-events"
  event_bus_name = aws_cloudwatch_event_bus.app.name
  event_pattern = jsonencode({ source = ["orderflow"] })
}
resource "aws_sqs_queue_policy" "events" {
  queue_url = aws_sqs_queue.events.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid = "AllowEventBridgeSend"
      Effect = "Allow"
      Principal = { Service = "events.amazonaws.com" }
      Action = "sqs:SendMessage"
      Resource = aws_sqs_queue.events.arn
      Condition = { ArnEquals = { "aws:SourceArn" = aws_cloudwatch_event_rule.orders.arn } }
    }]
  })
}
resource "aws_cloudwatch_event_target" "worker_queue" {
  rule = aws_cloudwatch_event_rule.orders.name
  event_bus_name = aws_cloudwatch_event_bus.app.name
  target_id = "worker-queue"
  arn = aws_sqs_queue.events.arn
  depends_on = [aws_sqs_queue_policy.events]
}
