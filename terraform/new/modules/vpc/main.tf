
# Create the VPC and its networking resources using the community VPC module.
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "6.7.3"

  # Set the VPC name and its overall private IP address range.
  name = var.name
  cidr = var.vpc_cidr

  # Define the Availability Zones and subnet CIDR ranges.
  # Each subnet CIDR should correspond to an Availability Zone.
  azs             = var.availability_zones
  public_subnets  = var.public_subnet_cidrs
  private_subnets = var.private_subnet_cidrs

  # Enable DNS resolution and DNS hostnames inside the VPC.
  enable_dns_support   = true
  enable_dns_hostnames = true

  # Control NAT gateway creation and whether one gateway is shared
  # across the private subnets to reduce costs.
  enable_nat_gateway = var.enable_nat_gateway
  single_nat_gateway = var.single_nat_gateway

  # Tag public subnets so Kubernetes can identify them for
  # internet-facing load balancers.
  public_subnet_tags = merge(
    var.common_tags,
    {
      "kubernetes.io/role/elb"            = "1"
      "kubernetes.io/cluster/${var.name}" = "shared"
    }
  )

  # Tag private subnets so Kubernetes can identify them for
  # internal load balancers.
  private_subnet_tags = merge(
    var.common_tags,
    {
      "kubernetes.io/role/internal-elb"   = "1"
      "kubernetes.io/cluster/${var.name}" = "shared"
    }
  )

  # Apply common project and environment tags to VPC resources.
  tags = var.common_tags
}
