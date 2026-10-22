variable "name" {
  description = "Common name prefix supplied by the root module."
  type        = string

  validation {
    condition     = length(trimspace(var.name)) > 0
    error_message = "name must not be empty."
  }
}

variable "vpc_cidr" {
  description = "IPv4 CIDR range allocated to the VPC."
  type        = string
  default     = "10.40.0.0/16"

  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "vpc_cidr must be a valid IPv4 CIDR block."
  }
}

variable "availability_zones" {
  description = "Availability zones to use. An empty list selects the first two available zones."
  type        = list(string)
  default     = []

  validation {
    condition = (
      length(var.availability_zones) == 0 ||
      (
        length(var.availability_zones) >= 2 &&
        length(distinct(var.availability_zones)) == length(var.availability_zones)
      )
    )
    error_message = "Specify at least two distinct availability zones, or leave the list empty."
  }
}

variable "public_subnet_cidrs" {
  description = "IPv4 CIDR blocks for public subnets, one per availability zone."
  type        = list(string)
  default     = ["10.40.101.0/24", "10.40.102.0/24"]

  validation {
    condition = (
      length(var.public_subnet_cidrs) >= 2 &&
      alltrue([
        for cidr in var.public_subnet_cidrs :
        can(cidrnetmask(cidr))
      ])
    )
    error_message = "Provide at least two valid IPv4 public subnet CIDRs."
  }
}

variable "private_subnet_cidrs" {
  description = "IPv4 CIDR blocks for private subnets, one per availability zone."
  type        = list(string)
  default     = ["10.40.1.0/24", "10.40.2.0/24"]

  validation {
    condition = (
      length(var.private_subnet_cidrs) >= 2 &&
      alltrue([
        for cidr in var.private_subnet_cidrs :
        can(cidrnetmask(cidr))
      ])
    )
    error_message = "Provide at least two valid IPv4 private subnet CIDRs."
  }
}

variable "enable_nat_gateway" {
  description = "Whether to create NAT gateways for private subnet outbound internet access."
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Use one shared NAT gateway instead of one per availability zone."
  type        = bool
  default     = true
}

variable "common_tags" {
  description = "Additional tags applied to networking resources."
  type        = map(string)
  default     = {}
}
