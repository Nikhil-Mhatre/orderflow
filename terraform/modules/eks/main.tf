
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.29.0"

  name               = var.cluster_name
  kubernetes_version = var.kubernetes_version

  vpc_id     = var.vpc_id
  subnet_ids = var.subnet_ids

  endpoint_public_access = true

  enable_cluster_creator_admin_permissions = true

  enabled_log_types = []

  eks_managed_node_groups = {
    default = {
      name           = "${var.cluster_name}-nodes"
      subnet_ids     = var.subnet_ids
      instance_types = ["t3.small"]
      capacity_type  = "ON_DEMAND"

      min_size     = 1
      max_size     = 1
      desired_size = 1
    }
  }

  tags = var.tags
}
