variable "project_name" {
  description = "Name of the project."
  type        = string
}

variable "environment" {
  description = "Deployment environment."
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC where RDS will be created."
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs used by the RDS DB subnet group."
  type        = list(string)

  validation {
    condition     = length(var.private_subnet_ids) >= 2
    error_message = "At least two private subnet IDs are required for the RDS DB subnet group."
  }
}

variable "database_name" {
  description = "Name of the PostgreSQL database."
  type        = string
}

variable "database_username" {
  description = "Master username for the PostgreSQL database."
  type        = string
}

variable "instance_class" {
  description = "RDS PostgreSQL instance class."
  type        = string
  default     = "db.t4g.micro"
}

variable "allocated_storage" {
  description = "Initial allocated storage in GiB."
  type        = number
  default     = 20
}

variable "application_security_group_id" {
  description = "Security group ID allowed to connect to PostgreSQL."
  type        = string
}
