# -----------------------------------------------------------------------------
# EKS Cluster IAM Role
# -----------------------------------------------------------------------------

resource "aws_iam_role" "cluster" {
  name = "${var.project_name}-${var.environment}-eks-cluster"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "eks.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-eks-cluster"
  }
}

resource "aws_iam_role_policy_attachment" "cluster_policy" {
  role       = aws_iam_role.cluster.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# -----------------------------------------------------------------------------
# EKS Cluster
# -----------------------------------------------------------------------------

resource "aws_eks_cluster" "this" {
  name     = "${var.project_name}-${var.environment}"
  role_arn = aws_iam_role.cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = var.private_subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs = [
      var.public_access_cidr
    ]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-eks"
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_policy
  ]
}

# -----------------------------------------------------------------------------
# EKS Worker Node IAM Role
# -----------------------------------------------------------------------------

resource "aws_iam_role" "node" {
  name = "${var.project_name}-${var.environment}-eks-node"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-eks-node"
  }
}

resource "aws_iam_role_policy_attachment" "node_worker" {
  role       = aws_iam_role.node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "node_cni" {
  role       = aws_iam_role.node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "node_ecr" {
  role       = aws_iam_role.node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPullOnly"
}

# -----------------------------------------------------------------------------
# EKS Worker Node Security Group
# -----------------------------------------------------------------------------

resource "aws_security_group" "nodes" {
  name        = "${var.project_name}-${var.environment}-eks-nodes"
  description = "Security group for OrderFlow EKS worker nodes"
  vpc_id      = var.vpc_id

  # Worker nodes need to communicate with the EKS control plane.
  ingress {
    description     = "EKS control plane to worker nodes"
    protocol        = "-1"
    from_port       = 0
    to_port         = 0
    security_groups = [aws_eks_cluster.this.vpc_config[0].cluster_security_group_id]
  }

  # Worker nodes communicate with other nodes for Kubernetes networking.
  ingress {
    description = "Worker node to worker node communication"
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    self        = true
  }

  # Nodes need outbound access to AWS services and the Internet through NAT.
  egress {
    description = "Allow outbound traffic"
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-eks-nodes"
  }
}

# -----------------------------------------------------------------------------
# EKS Worker Node Launch Template
# -----------------------------------------------------------------------------

resource "aws_launch_template" "nodes" {
  name = "${var.project_name}-${var.environment}-eks-nodes"

  vpc_security_group_ids = [
    aws_security_group.nodes.id
  ]

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "${var.project_name}-${var.environment}-eks-node"
    }
  }
}

# -----------------------------------------------------------------------------
# EKS Managed Node Group
# -----------------------------------------------------------------------------

resource "aws_eks_node_group" "this" {
  cluster_name  = aws_eks_cluster.this.name
  node_role_arn = aws_iam_role.node.arn

  subnet_ids = var.private_subnet_ids

  node_group_name = "${var.project_name}-${var.environment}-nodes"

  instance_types = var.node_instance_types

  scaling_config {
    desired_size = var.node_desired_size
    min_size     = var.node_min_size
    max_size     = var.node_max_size
  }

  launch_template {
    id      = aws_launch_template.nodes.id
    version = aws_launch_template.nodes.latest_version
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-eks-node"
  }

  depends_on = [
    aws_iam_role_policy_attachment.node_worker,
    aws_iam_role_policy_attachment.node_cni,
    aws_iam_role_policy_attachment.node_ecr
  ]
}

# -----------------------------------------------------------------------------
# EKS OIDC Provider
# -----------------------------------------------------------------------------

data "tls_certificate" "eks" {
  url = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks" {
  url = aws_eks_cluster.this.identity[0].oidc[0].issuer

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [
    data.tls_certificate.eks.certificates[0].sha1_fingerprint
  ]

  tags = {
    Name = "${var.project_name}-${var.environment}-eks-oidc"
  }
}

# -----------------------------------------------------------------------------
# AWS Load Balancer Controller IAM Role
# -----------------------------------------------------------------------------

data "aws_iam_policy_document" "load_balancer_controller_assume_role" {
  statement {
    effect = "Allow"

    actions = [
      "sts:AssumeRoleWithWebIdentity"
    ]

    principals {
      type = "Federated"

      identifiers = [
        aws_iam_openid_connect_provider.eks.arn
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:aud"

      values = [
        "sts.amazonaws.com"
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub"

      values = [
        "system:serviceaccount:${var.load_balancer_controller_namespace}:${var.load_balancer_controller_service_account}"
      ]
    }
  }
}

resource "aws_iam_role" "load_balancer_controller" {
  name = "${var.project_name}-${var.environment}-aws-load-balancer-controller"

  assume_role_policy = data.aws_iam_policy_document.load_balancer_controller_assume_role.json

  tags = {
    Name = "${var.project_name}-${var.environment}-aws-load-balancer-controller"
  }
}

# -----------------------------------------------------------------------------
# AWS Load Balancer Controller IAM Policy
# -----------------------------------------------------------------------------

resource "aws_iam_policy" "load_balancer_controller" {
  name = "${var.project_name}-${var.environment}-aws-load-balancer-controller"

  policy = file("${path.module}/policies/aws-load-balancer-controller-v2.14.1.json")

  tags = {
    Name = "${var.project_name}-${var.environment}-aws-load-balancer-controller"
  }
}

resource "aws_iam_role_policy_attachment" "load_balancer_controller" {
  role       = aws_iam_role.load_balancer_controller.name
  policy_arn = aws_iam_policy.load_balancer_controller.arn
}
