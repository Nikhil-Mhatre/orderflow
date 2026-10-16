resource "aws_kms_key" "app" {
  description = "Order Flow ${var.environment} encryption key"
  deletion_window_in_days = 7
  enable_key_rotation = true
}
resource "aws_kms_alias" "app" {
  name = "alias/${local.name}-app"
  target_key_id = aws_kms_key.app.key_id
}
