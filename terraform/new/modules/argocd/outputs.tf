output "namespace" {
  description = "Namespace where Argo CD is installed."
  value       = helm_release.argocd.namespace
}

output "release_name" {
  description = "Helm release name."
  value       = helm_release.argocd.name
}

output "release_status" {
  description = "Helm release status."
  value       = helm_release.argocd.status
}

output "root_application_name" {
  description = "Root Argo CD Application name."
  value       = var.root_application_name
}
