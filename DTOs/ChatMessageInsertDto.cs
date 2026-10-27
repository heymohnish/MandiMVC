namespace Mandi.DTOs
{
    public class ChatMessageInsertDto
    {
        public string Body { get; set; }
        public string CensoredBody { get; set; }
        public int FromId { get; set; }
        public int ToId { get; set; }
        public Role Sender { get; set; }
        public DateTime DateTime { get; set; }
        public int? SessionId { get; set; }
        public int IsAbusive { get; set; }
        public float? Sentiment { get; set; }
        public int IsConversational { get; set; }
        public int IsRead { get; set; }
        public MessageType Type { get; set; }
        public int IsFile { get; set; }
        public string FileLink { get; set; }
        public string Sid { get; set; }
        public string Status { get; set; }
        public int ServiceId { get; set; }
        public string ErrorMessage { get; set; }
        public int? ErrorCode { get; set; }

    }

    public enum MessageType
    {
        None,
        VideoCall,
        AudioCall,
        Cobrowse,
        ESignature,
        IDVerification,
        FaceBiometric,
        File,
        OTP,
        Reassign,
        OTPLink,
        Opt
    }
}
