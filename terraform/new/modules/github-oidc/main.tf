
# Retrieve the TLS certificate information for GitHub's OIDC endpoint.
data "tls_certificate" "github" {
  url = "https://token.actions.githubusercontent.com"
}

# Register GitHub Actions as an OIDC identity provider in AWS IAM.
# This allows AWS to validate identity tokens issued by GitHub Actions.
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  # AWS STS is the intended audience for GitHub's AWS role-assumption flow.
  client_id_list = ["sts.amazonaws.com"]

  # Supply the certificate thumbprint used by the OIDC provider configuration.
  thumbprint_list = [
    data.tls_certificate.github.certificates[0].sha1_fingerprint
  ]

  tags = var.common_tags
}

# Define the Trust Policy's conditions GitHub Actions must satisfy to assume the IAM role.
data "aws_iam_policy_document" "github_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    # Only tokens issued by the registered GitHub OIDC provider are trusted.
    principals {
      type = "Federated"

      identifiers = [
        aws_iam_openid_connect_provider.github.arn
      ]
    }

    # Require the AWS STS audience.
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # Restrict role assumption to the specified repository and branch.
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"

      values = [
        "repo:${var.github_org}/${var.github_repo}:ref:refs/heads/${var.github_deploy_branch}"
      ]
    }
  }
}

# Create the IAM role assumed by the GitHub Actions workflow.
resource "aws_iam_role" "github_actions" {
  name               = "${var.name}-github-actions"
  assume_role_policy = data.aws_iam_policy_document.github_assume_role.json

  tags = var.common_tags
}

# Define the AWS permissions required by the GitHub Actions workflow.
data "aws_iam_policy_document" "github_actions" {
  # Allow the workflow to authenticate to Amazon ECR.
  # GetAuthorizationToken requires Resource = "*".
  statement {
    sid       = "ECRAuthentication"
    effect    = "Allow"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  # Allow image publishing and image retrieval in the specified ECR repos.
  statement {
    sid    = "ECRImageOperations"
    effect = "Allow"

    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:CompleteLayerUpload",
      "ecr:DescribeImages",
      "ecr:DescribeRepositories",
      "ecr:GetDownloadUrlForLayer",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart"
    ]

    # Restrict repository operations to the ECR repositories passed by root.
    resources = var.ecr_repository_arns
  }
}

# Attach the permissions policy to the GitHub Actions IAM role.
resource "aws_iam_role_policy" "github_actions" {
  name   = "${var.name}-github-actions"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.github_actions.json
}
