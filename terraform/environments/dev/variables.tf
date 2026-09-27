variable "aws_region" {
  description = "AWS region where the OrderFlow development environment is deployed."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project."
  type        = string
  default     = "orderflow"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for the OrderFlow VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zone" {
  description = "Availability Zone used by the development environment."
  type        = string
  default     = "us-east-1a"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet."
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR block for the private subnet."
  type        = string
  default     = "10.0.2.0/24"
}
