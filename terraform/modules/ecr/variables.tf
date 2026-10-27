
variable "prefix" {
  description = "Project, environment and module name prefix."
  type        = string
}

variable "repository_prefix" {
  description = "Repository Prefix"
  type        = string
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
