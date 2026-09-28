output "db_instance_id" {
  description = "Identifier of the PostgreSQL RDS instance."
  value       = aws_db_instance.postgres.id
}

output "db_endpoint" {
  description = "DNS endpoint of the PostgreSQL database."
  value       = aws_db_instance.postgres.address
}

output "db_port" {
  description = "Port used by the PostgreSQL database."
  value       = aws_db_instance.postgres.port
}

output "db_name" {
  description = "Name of the PostgreSQL database."
  value       = aws_db_instance.postgres.db_name
}

output "db_username" {
  description = "Master username of the PostgreSQL database."
  value       = aws_db_instance.postgres.username
}

output "db_security_group_id" {
  description = "Security group ID attached to the PostgreSQL database."
  value       = aws_security_group.database.id
}

output "db_subnet_group_name" {
  description = "Name of the RDS DB subnet group."
  value       = aws_db_subnet_group.this.name
}

output "master_user_secret_arn" {
  description = "ARN of the Secrets Manager secret containing the RDS master credentials."
  value       = aws_db_instance.postgres.master_user_secret[0].secret_arn
}
