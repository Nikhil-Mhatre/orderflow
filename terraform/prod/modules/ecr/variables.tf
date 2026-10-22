
variable "name" {
  description = "Common name prefix supplied by the root module."
  type        = string

  validation {
    condition     = length(trimspace(var.name)) > 0
    error_message = "name must not be empty."
  }
}

variable "repository_names" {
  description = "Service names for which ECR repositories should be created."
  type        = list(string)
  default     = ["frontend", "api", "worker"]

  validation {
    condition = (
      length(var.repository_names) > 0 &&
      length(var.repository_names) == length(distinct(var.repository_names)) &&
      alltrue([
        for name in var.repository_names :
        can(regex("^[a-z0-9]+([._/-][a-z0-9]+)*$", name)) &&
        length(name) <= 256
      ])
    )
    error_message = "Repository names must be unique, non-empty valid lowercase ECR name segments."
  }
}

variable "image_tag_mutability" {
  description = "Whether image tags can be overwritten."
  type        = string
  default     = "IMMUTABLE"

  validation {
    condition = contains(
      ["MUTABLE", "IMMUTABLE"],
      var.image_tag_mutability
    )
    error_message = "image_tag_mutability must be MUTABLE or IMMUTABLE."
  }
}

variable "scan_on_push" {
  description = "Enable image vulnerability scanning on push."
  type        = bool
  default     = true
}

variable "max_image_count" {
  description = "Maximum number of images retained per repository."
  type        = number
  default     = 30

  validation {
    condition = (
      var.max_image_count >= 1 &&
      var.max_image_count == floor(var.max_image_count)
    )
    error_message = "max_image_count must be a positive integer."
  }
}

variable "common_tags" {
  description = "Additional tags applied to ECR repositories."
  type        = map(string)
  default     = {}
}
