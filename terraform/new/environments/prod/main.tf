
module "vpc" {
  source = "../../modules/vpc"

  prefix = "${var.project_name}-vpc"

  vpc_cidr = var.vpc_cidr

  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs

  enable_nat_gateway = var.enable_nat_gateway
  single_nat_gateway = var.single_nat_gateway

  common_tags = local.common_tags
}

module "ecr" {
  source            = "../../modules/ecr"
  prefix            = "${var.project_name}-ecr"
  repository_prefix = var.project_name

  repository_names = var.ecr_repository_names
  max_image_count  = var.ecr_max_image_count

  common_tags = local.common_tags
}

module "eks" {
  source = "../../modules/eks"

  prefix                       = "${var.project_name}-eks"
  endpoint_public_access_cidrs = var.endpoint_public_access_cidrs
  vpc_id                       = module.vpc.vpc_id
  private_subnets              = module.vpc.public_subnet_ids

  common_tags = local.common_tags
}


module "github_oidc" {
  source = "../../modules/github_oidc"

  prefix               = "${var.project_name}-github_oidc"
  subject_claim_prefix = var.subject_claim_prefix
  github_deploy_branch = var.github_deploy_branch
  ecr_repository_arns  = values(module.ecr.repository_arns)

  common_tags = local.common_tags
}
