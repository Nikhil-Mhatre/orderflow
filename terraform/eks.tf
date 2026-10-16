module "eks" {
  source = "terraform-aws-modules/eks/aws"
  version = "~> 20.37"
  cluster_name = local.name
  cluster_version = var.cluster_version
  vpc_id = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.private_subnets
  cluster_endpoint_public_access = true
  cluster_endpoint_public_access_cidrs = var.public_access_cidrs

  # EKS Auto Mode manages compute and load balancing.
  cluster_compute_config = {
    enabled = true
    node_pools = ["general-purpose", "system"]
  }
  cluster_kubernetes_network_config = {
    elastic_load_balancing = { enabled = true }
  }
  cluster_storage_config = {
    block_storage = { enabled = true }
  }
  enable_cluster_creator_admin_permissions = true
  cluster_addons = {
    eks-pod-identity-agent = {}
  }
}
