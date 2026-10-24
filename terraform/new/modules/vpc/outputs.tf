
output "vpc_id" {
  description = "ID of the VPC."
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "IPv4 CIDR block of the VPC."
  value       = module.vpc.vpc_cidr_block
}

output "vpc_name" {
  description = "Name assigned to the VPC."
  value       = var.name
}

output "availability_zones" {
  description = "Availability zones used by the VPC."
  value       = var.availability_zones
}

output "public_subnet_ids" {
  description = "IDs of the public subnets."
  value       = module.vpc.public_subnets
}

output "private_subnet_ids" {
  description = "IDs of the private subnets."
  value       = module.vpc.private_subnets
}

output "public_route_table_ids" {
  description = "IDs of public route tables."
  value       = module.vpc.public_route_table_ids
}

output "private_route_table_ids" {
  description = "IDs of private route tables."
  value       = module.vpc.private_route_table_ids
}

output "nat_gateway_ids" {
  description = "IDs of NAT gateways created by the VPC module."
  value       = module.vpc.natgw_ids
}
