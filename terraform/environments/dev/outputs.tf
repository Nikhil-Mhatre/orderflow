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

output "private_subnet_id" {
  description = "ID of the private subnet."
  value       = module.vpc.private_subnet_id
}

output "public_route_table_id" {
  description = "ID of the public route table."
  value       = module.vpc.public_route_table_id
}

output "private_route_table_id" {
  description = "ID of the private route table."
  value       = module.vpc.private_route_table_id
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
