resource "aws_secretsmanager_secret" "database" {
  name = "/${var.project_name}/${var.environment}/database"
  kms_key_id = aws_kms_key.app.arn
}
resource "aws_secretsmanager_secret_version" "database" {
  secret_id = aws_secretsmanager_secret.database.id
  secret_string = jsonencode({
    DATABASE_URL = "postgresql://${var.db_username}:${urlencode(random_password.database.result)}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${var.db_name}"
    DB_HOST = aws_db_instance.postgres.address
    DB_PORT = tostring(aws_db_instance.postgres.port)
    DB_NAME = var.db_name
    DB_USERNAME = var.db_username
    DB_PASSWORD = random_password.database.result
  })
}
resource "random_password" "jwt" { length = 48, special = false }
resource "aws_secretsmanager_secret" "app" {
  name = "/${var.project_name}/${var.environment}/app"
  kms_key_id = aws_kms_key.app.arn
}
resource "aws_secretsmanager_secret_version" "app" {
  secret_id = aws_secretsmanager_secret.app.id
  secret_string = jsonencode({ JWT_SECRET = random_password.jwt.result })
}
