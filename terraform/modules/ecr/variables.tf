variable "project_name" {
  description = "Name of the project."
  type        = string
}

variable "environment" {
  description = "Deployment environment."
  type        = string
}

variable "repository_names" {
  description = "Names of the ECR repositories to create."
  type        = set(string)
}
