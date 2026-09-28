# -----------------------------------------------------------------------------
# VPC Outputs
# -----------------------------------------------------------------------------

output "vpc_id" {
  description = "ID of the OrderFlow VPC."
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the OrderFlow VPC."
  value       = module.vpc.vpc_cidr
}

output "public_subnet_id" {
  description = "ID of the public subnet."
  value       = module.vpc.public_subnet_id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets."
  value       = module.vpc.private_subnet_ids
}

output "public_route_table_id" {
  description = "ID of the public route table."
  value       = module.vpc.public_route_table_id
}

output "private_route_table_ids" {
  description = "IDs of the private route tables."
  value       = module.vpc.private_route_table_ids
}

output "nat_gateway_id" {
  description = "ID of the NAT Gateway."
  value       = module.vpc.nat_gateway_id
}

output "vpc_endpoint_security_group_id" {
  description = "Security group ID used by the VPC interface endpoints."
  value       = module.vpc.vpc_endpoint_security_group_id
}

# -----------------------------------------------------------------------------
# ECR Outputs
# -----------------------------------------------------------------------------

output "ecr_repository_names" {
  description = "Names of the OrderFlow ECR repositories."
  value       = module.ecr.repository_names
}

output "ecr_repository_urls" {
  description = "URLs of the OrderFlow ECR repositories."
  value       = module.ecr.repository_urls
}

output "ecr_repository_arns" {
  description = "ARNs of the OrderFlow ECR repositories."
  value       = module.ecr.repository_arns
}

# -----------------------------------------------------------------------------
# IAM Outputs
# -----------------------------------------------------------------------------

output "github_actions_role_arn" {
  description = "ARN of the IAM role used by GitHub Actions."
  value       = module.iam.github_actions_role_arn
}

output "github_actions_role_name" {
  description = "Name of the IAM role used by GitHub Actions."
  value       = module.iam.github_actions_role_name
}

output "github_oidc_provider_arn" {
  description = "ARN of the GitHub Actions OIDC provider."
  value       = module.iam.github_oidc_provider_arn
}

# -----------------------------------------------------------------------------
# RDS Outputs
# -----------------------------------------------------------------------------

output "db_instance_id" {
  description = "Identifier of the PostgreSQL RDS instance."
  value       = module.rds.db_instance_id
}

output "db_endpoint" {
  description = "DNS endpoint of the PostgreSQL database."
  value       = module.rds.db_endpoint
}

output "db_port" {
  description = "Port used by the PostgreSQL database."
  value       = module.rds.db_port
}

output "db_name" {
  description = "Name of the PostgreSQL database."
  value       = module.rds.db_name
}

output "db_username" {
  description = "Master username of the PostgreSQL database."
  value       = module.rds.db_username
}

output "db_security_group_id" {
  description = "Security group ID attached to the PostgreSQL database."
  value       = module.rds.db_security_group_id
}

output "db_subnet_group_name" {
  description = "Name of the RDS DB subnet group."
  value       = module.rds.db_subnet_group_name
}

output "master_user_secret_arn" {
  description = "ARN of the Secrets Manager secret containing the RDS master credentials."
  value       = module.rds.master_user_secret_arn
}

# -----------------------------------------------------------------------------
# EKS Outputs
# -----------------------------------------------------------------------------

output "eks_cluster_name" {
  description = "Name of the EKS cluster."
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "API server endpoint of the EKS cluster."
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_arn" {
  description = "ARN of the EKS cluster."
  value       = module.eks.cluster_arn
}

output "eks_cluster_security_group_id" {
  description = "Security group ID of the EKS control plane."
  value       = module.eks.cluster_security_group_id
}

output "eks_node_security_group_id" {
  description = "Security group ID attached to the EKS worker nodes."
  value       = module.eks.node_security_group_id
}

output "eks_node_group_name" {
  description = "Name of the EKS managed node group."
  value       = module.eks.node_group_name
}
