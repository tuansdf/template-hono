import { z } from "zod";

export const emailSchema = z
  .string({
    required_error: "form.error.missing;field.email",
    invalid_type_error: "form.error.invalid;field.email",
  })
  .trim()
  .email("form.error.invalid;field.email");

export const usernameSchema = z
  .string({
    required_error: "form.error.missing;field.username",
    invalid_type_error: "form.error.invalid;field.username",
  })
  .trim()
  .min(2, "form.error.under_min_length;field.username;2")
  .max(255, "form.error.over_max_length;field.username;255");

export const passwordSchema = z
  .string({
    required_error: "form.error.missing;field.password",
    invalid_type_error: "form.error.invalid;field.password",
  })
  .min(8, "form.error.under_min_length;field.password;8")
  .max(64, "form.error.over_max_length;field.password;64");

export const tokenSchema = z
  .string({
    required_error: "form.error.invalid;field.token",
    invalid_type_error: "form.error.invalid;field.token",
  })
  .min(1, "form.error.invalid;field.token");
