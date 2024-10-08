﻿namespace API.Errors
{
    public class ApiException
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }

        public string? Details { get; set; }
        public ApiException(int statusCode, string message, string? detail)
        {
            this.StatusCode = statusCode;
            this.Message = message;
            this.Details = detail;
        }
    }
}
