terraform {
  required_providers {
    helm = {
      source = "hashicorp/helm"
    }

    kubectl = {
      source = "gavinbunney/kubectl"
    }
  }
}

# Install Argo CD into the EKS cluster using the official Argo Helm chart.
resource "helm_release" "argocd" {
  # Helm release name.
  name = "argocd"

  # Official repository containing the Argo CD Helm chart.
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"

  # Pin the chart version for predictable deployments.
  version = var.argocd_chart_version

  # Namespace where Argo CD components will be installed.
  namespace        = var.argocd_namespace
  create_namespace = true

  # Roll back the release if installation fails.
  atomic          = true
  cleanup_on_fail = true

  # Wait for Kubernetes resources to become ready before completing.
  wait    = true
  timeout = 900

  # Configure Argo CD and create the root Application through Helm values.
  values = [
    yamlencode({
      # Keep the Argo CD server internal to the cluster.
      # Application exposure can be configured separately through Ingress.
      server = {
        service = {
          type = "ClusterIP"
        }
      }
    })
  ]
}

# resource "kubectl_manifest" "root_application" {
#   yaml_body = yamlencode({
#     apiVersion = "argoproj.io/v1alpha1"
#     kind       = "Application"

#     metadata = {
#       name      = var.root_application_name
#       namespace = var.argocd_namespace
#     }

#     spec = {
#       project = "default"

#       source = {
#         repoURL        = var.gitops_repo_url
#         targetRevision = var.gitops_revision
#         path           = var.gitops_path
#       }

#       destination = {
#         server    = "https://kubernetes.default.svc"
#         namespace = var.destination_namespace
#       }

#       syncPolicy = {
#         automated = {
#           selfHeal   = true
#           prune      = var.enable_prune
#           allowEmpty = false
#         }

#         syncOptions = ["CreateNamespace=true"]
#       }
#     }
#   })

#   depends_on = [
#     helm_release.argocd
#   ]
# }
