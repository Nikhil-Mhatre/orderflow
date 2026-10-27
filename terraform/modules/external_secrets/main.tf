
data "aws_caller_identity" "current" {}

// Creating role for external secrets
resource "aws_iam_role" "external_secrets" {
  name = "${var.cluster_name}-external-secrets"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "pods.eks.amazonaws.com"
      }
      Action = [
        "sts:AssumeRole",
        "sts:TagSession"
      ]
    }]
  })
}

// creating policy for external secrets
resource "aws_iam_policy" "read_rds_secret" {
  name        = "${var.cluster_name}-external-secrets-read-rds"
  description = "Allow ESO to read the specified RDS master secret."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ]
      Resource = var.rds_master_secret_arn
    }]
  })
}

// Attaching the policy to the role
resource "aws_iam_role_policy_attachment" "read_rds_secret" {
  role       = aws_iam_role.external_secrets.name
  policy_arn = aws_iam_policy.read_rds_secret.arn
}

//creating service account for consuming secret
# resource "helm_release" "external_secrets" {
#   name       = "external-secrets"
#   repository = "https://charts.external-secrets.io"
#   chart      = "external-secrets"
#   version    = var.helm_chart_version
#   namespace  = var.namespace

#   create_namespace = true

#   wait    = true
#   atomic  = true
#   timeout = 600

#   values = [
#     yamlencode({
#       serviceAccount = {
#         create = true
#         name   = "external-secrets"
#       }
#     })
#   ]
# }

// Attaching the role to the service account
resource "aws_eks_pod_identity_association" "external_secrets" {
  cluster_name    = var.cluster_name
  namespace       = var.namespace
  service_account = "external-secrets"
  role_arn        = aws_iam_role.external_secrets.arn

  depends_on = [
    aws_iam_role_policy_attachment.read_rds_secret,
    # helm_release.external_secrets
  ]
}
