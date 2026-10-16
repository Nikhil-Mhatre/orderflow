variable "aws_region" {\n  type = string\n  default = "us-east-1"\n}
variable "project_name" {\n  type = string\n  default = "orderflow"\n}
variable "environment" {\n  type = string\n  default = "dev"\n}
variable "cluster_version" {
  description = "Confirm this EKS version is supported in your region before apply."
  type = string
  default = "1.33"
}
variable "vpc_cidr" {\n  type = string\n  default = "10.40.0.0/16"\n}
variable "public_access_cidrs" {
  description = "Restrict EKS API access to your public IP /32."
  type = list(string)
  default = ["YOUR_PUBLIC_IP/32"]
}
variable "db_name" {\n  type = string\n  default = "orderflow"\n}
variable "db_username" {\n  type = string\n  default = "orderflow_admin"\n}
variable "db_instance_class" {\n  type = string\n  default = "db.t3.micro"\n}
variable "db_backup_retention_days" {
  description = "One day works with many Free Tier account restrictions; verify account limits."
  type = number
  default = 1
}
variable "github_owner" { type = string }
variable "github_source_repo" { type = string, default = "order-flow" }
