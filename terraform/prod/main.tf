
module "vpc" {
  source = "./modules/vpc"

  name = local.name

  vpc_cidr = var.vpc_cidr

  availability_zones   = local.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs

  enable_nat_gateway = var.enable_nat_gateway
  single_nat_gateway = var.single_nat_gateway

  common_tags = local.common_tags
}

module "ecr" {
  source = "./modules/ecr"
  name   = local.name

  repository_names     = var.ecr_repository_names
  image_tag_mutability = var.ecr_image_tag_mutability
  scan_on_push         = var.ecr_scan_on_push
  max_image_count      = var.ecr_max_image_count

  common_tags = local.common_tags
}
