resource "aws_cloudwatch_log_group" "worker" {
  name              = "/order-flow/${var.environment}/worker"
  retention_in_days = 30
}

resource "aws_cloudwatch_metric_alarm" "processing_dlq_messages" {
  alarm_name          = "${local.name}-processing-dlq-not-empty"
  alarm_description   = "Processing DLQ has visible messages."
  namespace           = "AWS/SQS"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  statistic           = "Maximum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 0
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.processing_dlq.name
  }
}

resource "aws_cloudwatch_metric_alarm" "eventbridge_dlq_messages" {
  alarm_name          = "${local.name}-eventbridge-dlq-not-empty"
  alarm_description   = "EventBridge delivery DLQ has visible messages."
  namespace           = "AWS/SQS"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  statistic           = "Maximum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 0
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.eventbridge_dlq.name
  }
}

resource "aws_cloudwatch_metric_alarm" "processing_queue_age" {
  alarm_name          = "${local.name}-processing-queue-age"
  alarm_description   = "Oldest message in the processing queue is over five minutes old."
  namespace           = "AWS/SQS"
  metric_name         = "ApproximateAgeOfOldestMessage"
  statistic           = "Maximum"
  period              = 60
  evaluation_periods  = 2
  threshold           = 300
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.processing.name
  }
}
