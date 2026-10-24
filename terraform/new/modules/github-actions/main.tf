
# -----------------------------------------------------------------------------
# GitHub Actions IAM Role
#
# Purpose:
#   Allow the OrderFlow GitHub Actions workflow to authenticate to AWS using
#   OIDC and temporary credentials instead of long-lived AWS access keys.
#
# Responsibilities:
#   1. Configure GitHub OIDC trust for the IAM role.
#   2. Restrict role assumption to the approved GitHub repository and branch.
#   3. Allow image operations only on the specified ECR repositories.
#   4. Allow the workflow to describe the specified EKS cluster.
#
# Note:
#   EKS cluster discovery does not itself grant Kubernetes deployment access.
# -----------------------------------------------------------------------------

module "github_actions_iam" {
  # Use the community-maintained AWS IAM role submodule.
  source  = "terraform-aws-modules/iam/aws//modules/iam-role"
  version = "6.8.2"

  # Give the role a predictable name based on project and environment.
  name = "${var.name}-github-actions"

  # Enable GitHub Actions OIDC as a trusted identity provider.
  enable_github_oidc = true

  # Allow only this exact GitHub OIDC subject to assume the role.
  # Expected format:
  # repo:OWNER/REPOSITORY:ref:refs/heads/BRANCH
  #
  # Replace the placeholders with your actual repository details.
  # If the workflow uses a GitHub Environment or immutable subject claims,
  # configure the subject to match the token GitHub actually issues.
  oidc_subjects = [
    var.github_oidc_subject
  ]

  # Create an inline IAM policy for the permissions defined below.
  # Inline policies keep the role's project-specific permissions together.
  create_inline_policy = true

  # Define permissions as separate statements to make reviews and updates
  # easier. Each statement has its own purpose and resource scope.
  inline_policy_permissions = {
    # ECR authorization tokens are not restricted to individual repositories.
    # AWS requires Resource = "*" for this action.
    ECRAuthorization = {
      actions = [
        "ecr:GetAuthorizationToken"
      ]

      resources = ["*"]
    }

    # Permit uploading and retrieving container images from approved
    # repositories only. Repository ARNs are passed into this module.
    ECRImageOperations = {
      actions = [
        "ecr:BatchCheckLayerAvailability",
        "ecr:CompleteLayerUpload",
        "ecr:InitiateLayerUpload",
        "ecr:PutImage",
        "ecr:UploadLayerPart",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer",
        "ecr:DescribeRepositories"
      ]

      resources = var.ecr_repository_arns
    }

  }

  # Apply standard project and environment tags for resource management.
  tags = var.common_tags
}
