
variable "prefix" {
  description = "Project and environment name prefix."
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC hosting the database."
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs used by the RDS DB subnet group."
  type        = list(string)

  validation {
    condition     = length(var.private_subnet_ids) >= 2
    error_message = "Provide at least two private subnet IDs in different Availability Zones."
  }
}

variable "eks_security_group_id" {
  description = "Security group ID permitted to connect to PostgreSQL."
  type        = string
}


variable "db_name" {
  description = "Initial database name."
  type        = string
}

variable "db_username" {
  description = "Master database username."
  type        = string
}


variable "db_deletion_protection" {
  description = "Whether to prevent accidental deletion of the database."
  type        = bool
  default     = false
}

variable "common_tags" {
  description = "Common tags applied to database resources."
  type        = map(string)
  default     = {}
}
