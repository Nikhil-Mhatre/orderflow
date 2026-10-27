variable "name_prefix" {
  description = "Prefix used to name the queues and EventBridge rule."
  type        = string
}

variable "tags" {
  description = "Tags applied to supported resources."
  type        = map(string)
  default     = {}
}

variable "queue_name" {
  description = "Optional explicit primary queue name. Defaults to <name_prefix>-queue."
  type        = string
  default     = null
}

variable "dlq_name" {
  description = "Optional explicit processing DLQ name. Defaults to <name_prefix>-dlq."
  type        = string
  default     = null
}

variable "message_retention_seconds" {
  description = "How long SQS retains messages, in seconds."
  type        = number
  default     = 345600
}

variable "visibility_timeout_seconds" {
  description = "Visibility timeout for messages being processed."
  type        = number
  default     = 60
}

variable "max_receive_count" {
  description = "Number of receives before a message is moved to the processing DLQ."
  type        = number
  default     = 5
}

variable "enable_sqs_managed_encryption" {
  description = "Enable SQS-managed server-side encryption."
  type        = bool
  default     = true
}

variable "schedule_expression" {
  description = "EventBridge schedule expression, e.g. rate(5 minutes) or cron(0 12 * * ? *). Set null to use an event pattern."
  type        = string
  default     = "rate(5 minutes)"
  nullable    = true
}

variable "event_pattern_json" {
  description = "JSON event pattern for the EventBridge rule. Set null when using a schedule."
  type        = string
  default     = null
  nullable    = true
}

variable "event_bus_name" {
  description = "EventBridge event bus name. Defaults to the account default bus."
  type        = string
  default     = "default"
}

variable "eventbridge_retry_max_attempts" {
  description = "Maximum EventBridge delivery attempts to the primary SQS queue."
  type        = number
  default     = 185
}

variable "eventbridge_retry_max_age_seconds" {
  description = "Maximum EventBridge event age for retries."
  type        = number
  default     = 86400
}

variable "create_eventbridge_delivery_dlq" {
  description = "Create a separate SQS DLQ for events EventBridge cannot deliver to the target."
  type        = bool
  default     = true
}

variable "eventbridge_delivery_dlq_name" {
  description = "Optional name for the EventBridge target delivery DLQ."
  type        = string
  default     = null
}

variable "eventbridge_delivery_dlq_retention_seconds" {
  description = "Retention for the EventBridge target delivery DLQ."
  type        = number
  default     = 1209600
}

variable "rule_description" {
  description = "Optional description for the EventBridge rule."
  type        = string
  default     = "Routes EventBridge events to SQS."
}
