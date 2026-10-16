locals {
  name = "${var.project_name}-${var.environment}"
  services = toset(["api", "worker", "web"])
}
data "aws_availability_zones" "available" { state = "available" }
