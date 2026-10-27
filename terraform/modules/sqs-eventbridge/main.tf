locals {
  queue_name = coalesce(var.queue_name, "${var.name_prefix}-queue")
  dlq_name   = coalesce(var.dlq_name, "${var.name_prefix}-dlq")
  eventbridge_delivery_dlq_name = coalesce(
    var.eventbridge_delivery_dlq_name,
    "${var.name_prefix}-eventbridge-delivery-dlq"
  )

  using_schedule      = var.schedule_expression != null
  using_event_pattern = var.event_pattern_json != null

  common_tags = var.tags
}

resource "aws_sqs_queue" "processing_dlq" {
  name                      = local.dlq_name
  message_retention_seconds = var.message_retention_seconds
  sqs_managed_sse_enabled   = var.enable_sqs_managed_encryption
  tags                      = local.common_tags
}

resource "aws_sqs_queue" "main" {
  name                       = local.queue_name
  message_retention_seconds  = var.message_retention_seconds
  visibility_timeout_seconds = var.visibility_timeout_seconds
  sqs_managed_sse_enabled    = var.enable_sqs_managed_encryption

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.processing_dlq.arn
    maxReceiveCount     = var.max_receive_count
  })

  tags = local.common_tags
}

resource "aws_cloudwatch_event_rule" "this" {
  name           = "${var.name_prefix}-rule"
  description    = var.rule_description
  event_bus_name = var.event_bus_name
  schedule_expression = local.using_schedule ? var.schedule_expression : null
  event_pattern       = local.using_event_pattern ? var.event_pattern_json : null

  lifecycle {
    precondition {
      condition     = local.using_schedule != local.using_event_pattern
      error_message = "Set exactly one of schedule_expression or event_pattern_json (not both and not neither)."
    }
  }

  tags = local.common_tags
}

resource "aws_sqs_queue" "eventbridge_delivery_dlq" {
  count = var.create_eventbridge_delivery_dlq ? 1 : 0

  name                      = local.eventbridge_delivery_dlq_name
  message_retention_seconds = var.eventbridge_delivery_dlq_retention_seconds
  sqs_managed_sse_enabled   = var.enable_sqs_managed_encryption
  tags                      = local.common_tags
}

resource "aws_cloudwatch_event_target" "sqs" {
  rule           = aws_cloudwatch_event_rule.this.name
  event_bus_name = var.event_bus_name
  target_id      = "${var.name_prefix}-sqs-target"
  arn            = aws_sqs_queue.main.arn

  retry_policy {
    maximum_event_age_in_seconds = var.eventbridge_retry_max_age_seconds
    maximum_retry_attempts       = var.eventbridge_retry_max_attempts
  }

  dynamic "dead_letter_config" {
    for_each = var.create_eventbridge_delivery_dlq ? [1] : []
    content {
      arn = aws_sqs_queue.eventbridge_delivery_dlq[0].arn
    }
  }
}

data "aws_iam_policy_document" "main_queue_policy" {
  statement {
    sid    = "AllowEventBridgeSendMessage"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.main.arn]

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_cloudwatch_event_rule.this.arn]
    }
  }
}

resource "aws_sqs_queue_policy" "main" {
  queue_url = aws_sqs_queue.main.id
  policy    = data.aws_iam_policy_document.main_queue_policy.json
}

data "aws_iam_policy_document" "eventbridge_delivery_dlq_policy" {
  count = var.create_eventbridge_delivery_dlq ? 1 : 0

  statement {
    sid    = "AllowEventBridgeSendFailedDeliveries"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.eventbridge_delivery_dlq[0].arn]

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_cloudwatch_event_rule.this.arn]
    }
  }
}

resource "aws_sqs_queue_policy" "eventbridge_delivery_dlq" {
  count     = var.create_eventbridge_delivery_dlq ? 1 : 0
  queue_url = aws_sqs_queue.eventbridge_delivery_dlq[0].id
  policy    = data.aws_iam_policy_document.eventbridge_delivery_dlq_policy[0].json
}
