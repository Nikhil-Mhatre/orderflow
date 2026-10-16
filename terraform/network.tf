module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.14"
  name = local.name
  cidr = var.vpc_cidr
  azs = slice(data.aws_availability_zones.available.names, 0, 3)
  private_subnets  = [cidrsubnet(var.vpc_cidr, 4, 0), cidrsubnet(var.vpc_cidr, 4, 1), cidrsubnet(var.vpc_cidr, 4, 2)]
  public_subnets   = [cidrsubnet(var.vpc_cidr, 8, 48), cidrsubnet(var.vpc_cidr, 8, 49), cidrsubnet(var.vpc_cidr, 8, 50)]
  database_subnets = [cidrsubnet(var.vpc_cidr, 4, 3), cidrsubnet(var.vpc_cidr, 4, 4), cidrsubnet(var.vpc_cidr, 4, 5)]
  enable_nat_gateway = true
  single_nat_gateway = true
  create_database_subnet_group = false
  enable_dns_hostnames = true
  enable_dns_support = true
  public_subnet_tags = { "kubernetes.io/role/elb" = "1" }
  private_subnet_tags = { "kubernetes.io/role/internal-elb" = "1" }
}
