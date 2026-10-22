
# ***************************************************
# ---------------------- VPC ------------------------
# ***************************************************

output "vpc_id" {
  description = "ID of the VPC."
  value       = module.vpc.vpc_id
}

output "nat_gateway_ids" {
  description = "IDs of NAT gateways created by the vpc module."
  value       = module.vpc.nat_gateway_ids
}

# ***************************************************
# ---------------------- ECR ------------------------
# ***************************************************

output "ecr_repository_names" {
  description = "Full ECR repository names keyed by service."
  value       = module.ecr.repository_names
}

output "ecr_repository_urls" {
  description = "ECR repository URLs keyed by service."
  value       = module.ecr.repository_urls
}
