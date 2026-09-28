output "vpc_id" {
  description = "ID of the OrderFlow VPC."
  value       = aws_vpc.this.id
}

output "vpc_cidr" {
  description = "CIDR block of the OrderFlow VPC."
  value       = aws_vpc.this.cidr_block
}

output "public_subnet_id" {
  description = "ID of the public subnet."
  value       = aws_subnet.public.id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets."
  value = [
    for subnet in aws_subnet.private :
    subnet.id
  ]
}

output "public_route_table_id" {
  description = "ID of the public route table."
  value       = aws_route_table.public.id
}

output "private_route_table_ids" {
  description = "IDs of the private route tables."
  value = [
    for route_table in aws_route_table.private :
    route_table.id
  ]
}

output "nat_gateway_id" {
  description = "ID of the NAT Gateway."
  value       = aws_nat_gateway.this.id
}

output "vpc_endpoint_security_group_id" {
  description = "Security group ID used by the VPC interface endpoints."
  value       = aws_security_group.vpc_endpoints.id
}
