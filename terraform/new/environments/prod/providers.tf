
# Configure the AWS provider for the selected deployment region.
provider "aws" {
  region = var.aws_region

  # Apply common tags automatically to supported AWS resources.
  default_tags {
    tags = local.common_tags
  }
}

data "aws_eks_cluster" "cluster" {
  name = module.eks.eks_cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.eks_cluster_name
}

provider "helm" {
  kubernetes = {
    host = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(
      data.aws_eks_cluster.cluster.certificate_authority[0].data
    )
    token = data.aws_eks_cluster_auth.cluster.token
  }
}
