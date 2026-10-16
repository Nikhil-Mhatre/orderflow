resource "aws_cloudwatch_log_group" "app" {
  name = "/${var.project_name}/${var.environment}/application"
  retention_in_days = 30
  kms_key_id = aws_kms_key.app.arn
}
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name = "${local.name}-rds-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods = 2
  metric_name = "CPUUtilization"
  namespace = "AWS/RDS"
  period = 300
  statistic = "Average"
  threshold = 80
  alarm_description = "RDS CPU above 80 percent for two periods."
  dimensions = { DBInstanceIdentifier = aws_db_instance.postgres.identifier }
}
