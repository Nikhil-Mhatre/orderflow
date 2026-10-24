
module "vpc" {
  source = "../../modules/vpc"

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
  source = "../../modules/ecr"
  name   = local.name

  repository_names = var.ecr_repository_names
  max_image_count  = var.ecr_max_image_count

  common_tags = local.common_tags
}

module "eks" {
  source = "../../modules/eks"

  name                         = local.name
  endpoint_public_access_cidrs = var.endpoint_public_access_cidrs
  vpc_id                       = module.vpc.vpc_id
  private_subnets              = module.vpc.public_subnet_ids

  common_tags = local.common_tags
}


module "github_actions_iam" {
  source = "../../modules/github"

  # Use your existing shared project/environment name.
  name = local.name

  # Use the exact OIDC subject for your repository and workflow.
  github_oidc_subject = var.github_oidc_subject

  # Replace this expression if your ECR module exposes a different output.
  ecr_repository_arns = values(module.ecr.repository_arns)

  # Reuse your project's common tags.
  common_tags = local.common_tags
}
