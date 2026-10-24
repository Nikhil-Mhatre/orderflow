
output "db_instance_id" {
  description = "RDS database instance identifier."
  value       = module.postgres.db_instance_identifier
}

output "db_instance_endpoint" {
  description = "RDS connection endpoint, including port."
  value       = module.postgres.db_instance_endpoint
}

output "db_instance_address" {
  description = "RDS database hostname."
  value       = module.postgres.db_instance_address
}

output "db_instance_port" {
  description = "RDS database port."
  value       = module.postgres.db_instance_port
}

output "db_instance_name" {
  description = "Name of the initial database."
  value       = module.postgres.db_instance_name
}

output "db_master_user_secret_arn" {
  description = "ARN of the Secrets Manager secret containing the managed master credentials."
  value       = module.postgres.db_instance_master_user_secret_arn
}

output "db_security_group_id" {
  description = "Security group ID attached to the database."
  value       = aws_security_group.database.id
}
