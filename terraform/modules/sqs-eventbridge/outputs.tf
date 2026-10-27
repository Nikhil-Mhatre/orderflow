output "queue_name" {
  description = "Primary SQS queue name."
  value       = aws_sqs_queue.main.name
}

output "queue_url" {
  description = "Primary SQS queue URL."
  value       = aws_sqs_queue.main.url
}

output "queue_arn" {
  description = "Primary SQS queue ARN."
  value       = aws_sqs_queue.main.arn
}

output "processing_dlq_name" {
  description = "Processing dead-letter queue name."
  value       = aws_sqs_queue.processing_dlq.name
}

output "processing_dlq_url" {
  description = "Processing dead-letter queue URL."
  value       = aws_sqs_queue.processing_dlq.url
}

output "processing_dlq_arn" {
  description = "Processing dead-letter queue ARN."
  value       = aws_sqs_queue.processing_dlq.arn
}

output "eventbridge_rule_name" {
  description = "EventBridge rule name."
  value       = aws_cloudwatch_event_rule.this.name
}

output "eventbridge_rule_arn" {
  description = "EventBridge rule ARN."
  value       = aws_cloudwatch_event_rule.this.arn
}

output "eventbridge_delivery_dlq_arn" {
  description = "EventBridge target delivery DLQ ARN, or null if disabled."
  value       = var.create_eventbridge_delivery_dlq ? aws_sqs_queue.eventbridge_delivery_dlq[0].arn : null
}
