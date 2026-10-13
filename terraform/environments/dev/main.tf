
locals {
  common_tags = {
    ManagedBy   = "Terraform"
    Owner       = "Nikhil Mhatre"
    Project     = "Orderflow"
    Environment = var.environment
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

module "vpc" {
  source = "../../modules/vpc"

  name = "${var.cluster_name}-vpc"

  vpc_cidr = "10.0.0.0/16"

  availability_zones = slice(
    data.aws_availability_zones.available.names,
    0,
    2
  )

  public_subnets = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]

  tags = local.common_tags
}

module "eks" {
  source = "../../modules/eks"

  cluster_name       = var.cluster_name
  kubernetes_version = var.kubernetes_version

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.public_subnet_ids

  tags = local.common_tags
}
