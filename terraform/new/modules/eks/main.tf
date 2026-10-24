
# Create and configure the Amazon EKS cluster using the official
# terraform-aws-modules/eks/aws community module.
module "eks" {
  # Source of the EKS module from the Terraform Registry.
  source = "terraform-aws-modules/eks/aws"

  # Allow compatible releases within the 21.x major version series.
  version = "~> 21.0"

  # Set the EKS cluster name using the value provided by the root module.
  name = var.name

  # Specify the Kubernetes version to run on the EKS cluster.
  kubernetes_version = 1.33

  # Allow clients to access the Kubernetes API through its public endpoint.
  endpoint_public_access = true

  # Restrict public API access to the CIDR ranges provided as input.
  # Use trusted IP ranges rather than allowing access from anywhere.
  endpoint_public_access_cidrs = var.endpoint_public_access_cidrs

  # Also enable the private API endpoint for access from within the VPC.
  endpoint_private_access = true

  # Associate the EKS cluster with the existing VPC.
  vpc_id = var.vpc_id

  # Place EKS networking resources in the supplied private subnets.
  subnet_ids = var.private_subnets

  # Enable EKS managed compute capability and configure its node pools.
  compute_config = {
    enabled = true // false to disable the EKS Auto-mode

    # Define the general-purpose and system node pools.
    node_pools = ["general-purpose", "system"]
  }

  # Grant the IAM principal creating the cluster administrator permissions.
  # This is useful during initial setup; review access before production use.
  enable_cluster_creator_admin_permissions = true

  # Apply the common tags supplied by the root module.
  tags = var.common_tags
}
