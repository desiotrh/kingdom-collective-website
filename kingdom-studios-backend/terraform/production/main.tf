# ==============================================
# KINGDOM STUDIOS BACKEND - TERRAFORM CONFIGURATION
# Multi-cloud infrastructure as code
# ==============================================

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
  
  backend "s3" {
    bucket  = "kingdom-studios-terraform-state"
    key     = "production/backend/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

# ==============================================
# VARIABLES
# ==============================================

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "kingdom-studios"
}

variable "region_aws" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "region_gcp" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "region_azure" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "min_replicas" {
  description = "Minimum number of replicas"
  type        = number
  default     = 3
}

variable "max_replicas" {
  description = "Maximum number of replicas"
  type        = number
  default     = 50
}

variable "instance_type_aws" {
  description = "AWS EC2 instance type"
  type        = string
  default     = "t3.large"
}

variable "machine_type_gcp" {
  description = "GCP machine type"
  type        = string
  default     = "e2-standard-4"
}

variable "vm_size_azure" {
  description = "Azure VM size"
  type        = string
  default     = "Standard_D4s_v3"
}

variable "enable_monitoring" {
  description = "Enable monitoring stack"
  type        = bool
  default     = true
}

variable "enable_logging" {
  description = "Enable centralized logging"
  type        = bool
  default     = true
}

variable "ssl_certificate_arn" {
  description = "SSL certificate ARN for AWS"
  type        = string
  default     = ""
}

# ==============================================
# DATA SOURCES
# ==============================================

data "aws_availability_zones" "available" {
  state = "available"
}

data "google_client_config" "default" {}

data "azurerm_client_config" "current" {}

# ==============================================
# LOCALS
# ==============================================

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    CreatedAt   = timestamp()
  }
  
  name_prefix = "${var.project_name}-${var.environment}"
  
  # Multi-cloud configuration
  cloud_configs = {
    aws = {
      enabled = true
      region  = var.region_aws
    }
    gcp = {
      enabled = false  # Set to true to enable GCP
      region  = var.region_gcp
    }
    azure = {
      enabled = false  # Set to true to enable Azure
      region  = var.region_azure
    }
  }
}

# ==============================================
# AWS PROVIDER CONFIGURATION
# ==============================================

provider "aws" {
  region = var.region_aws
  
  default_tags {
    tags = local.common_tags
  }
}

# ==============================================
# GCP PROVIDER CONFIGURATION
# ==============================================

provider "google" {
  count   = local.cloud_configs.gcp.enabled ? 1 : 0
  project = "${var.project_name}-prod"
  region  = var.region_gcp
}

# ==============================================
# AZURE PROVIDER CONFIGURATION
# ==============================================

provider "azurerm" {
  count = local.cloud_configs.azure.enabled ? 1 : 0
  features {}
}

# ==============================================
# OUTPUTS
# ==============================================

output "aws_load_balancer_dns" {
  description = "AWS Load Balancer DNS name"
  value       = local.cloud_configs.aws.enabled ? module.aws_infrastructure[0].load_balancer_dns : null
}

output "gcp_load_balancer_ip" {
  description = "GCP Load Balancer IP"
  value       = local.cloud_configs.gcp.enabled ? module.gcp_infrastructure[0].load_balancer_ip : null
}

output "azure_load_balancer_ip" {
  description = "Azure Load Balancer IP"
  value       = local.cloud_configs.azure.enabled ? module.azure_infrastructure[0].load_balancer_ip : null
}

output "database_connection_strings" {
  description = "Database connection strings"
  value = {
    aws   = local.cloud_configs.aws.enabled ? module.aws_infrastructure[0].database_connection_string : null
    gcp   = local.cloud_configs.gcp.enabled ? module.gcp_infrastructure[0].database_connection_string : null
    azure = local.cloud_configs.azure.enabled ? module.azure_infrastructure[0].database_connection_string : null
  }
  sensitive = true
}

output "redis_endpoints" {
  description = "Redis cache endpoints"
  value = {
    aws   = local.cloud_configs.aws.enabled ? module.aws_infrastructure[0].redis_endpoint : null
    gcp   = local.cloud_configs.gcp.enabled ? module.gcp_infrastructure[0].redis_endpoint : null
    azure = local.cloud_configs.azure.enabled ? module.azure_infrastructure[0].redis_endpoint : null
  }
  sensitive = true
}

output "monitoring_dashboards" {
  description = "Monitoring dashboard URLs"
  value = {
    aws   = local.cloud_configs.aws.enabled ? module.aws_infrastructure[0].monitoring_dashboard : null
    gcp   = local.cloud_configs.gcp.enabled ? module.gcp_infrastructure[0].monitoring_dashboard : null
    azure = local.cloud_configs.azure.enabled ? module.azure_infrastructure[0].monitoring_dashboard : null
  }
}
