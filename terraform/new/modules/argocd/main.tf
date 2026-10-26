resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = var.argocd_chart_version
  namespace        = var.argocd_namespace
  create_namespace = true

  atomic          = true
  cleanup_on_fail = true
  wait            = true
  timeout         = 900

  values = [
    yamlencode({
      server = {
        service = {
          type = "ClusterIP"
        }
      }

      extraObjects = [
        {
          apiVersion = "argoproj.io/v1alpha1"
          kind       = "Application"
          metadata = {
            name      = var.root_application_name
            namespace = var.argocd_namespace
          }
          spec = {
            project = "default"
            source = {
              repoURL        = var.gitops_repo_url
              targetRevision = var.gitops_revision
              path           = var.gitops_path
            }
            destination = {
              server    = "https://kubernetes.default.svc"
              namespace = var.destination_namespace
            }
            syncPolicy = {
              automated = {
                prune      = var.enable_prune
                selfHeal   = true
                allowEmpty = false
              }
              syncOptions = ["CreateNamespace=true"]
            }
          }
        }
      ]
    })
  ]
}
