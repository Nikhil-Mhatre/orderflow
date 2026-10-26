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

      # Create an Argo CD Application that tracks the GitOps repository.
      extraObjects = [
        {
          apiVersion = "argoproj.io/v1alpha1"
          kind       = "Application"

          # The Application must be created in the Argo CD namespace.
          metadata = {
            name      = var.root_application_name
            namespace = var.argocd_namespace
          }

          spec = {
            # Use the default Argo CD project.
            project = "default"

            # Define the Git repository and directory containing manifests.
            source = {
              repoURL        = var.gitops_repo_url
              targetRevision = var.gitops_revision
              path           = var.gitops_path
            }

            # Deploy resources to the local Kubernetes cluster.
            destination = {
              server    = "https://kubernetes.default.svc"
              namespace = var.destination_namespace
            }

            # Automatically reconcile cluster state with Git.
            syncPolicy = {
              automated = {
                # Delete resources removed from Git only when explicitly enabled.
                prune = var.enable_prune

                # Reconcile manual changes in the cluster back to Git state.
                selfHeal = true

                # Prevent pruning all managed resources when the source is empty.
                allowEmpty = false
              }

              # Create the destination namespace if it does not exist.
              syncOptions = ["CreateNamespace=true"]
            }
          }
        }
      ]
    })
  ]
}
