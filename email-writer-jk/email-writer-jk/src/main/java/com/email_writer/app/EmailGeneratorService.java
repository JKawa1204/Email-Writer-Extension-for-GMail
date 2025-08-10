package com.email_writer.app;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailGeneratorService {
    
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApikey;

    public String generateEmailReply(EmailRequest emailrequest){
          //Build the prompt
          String prompt = buildPrompt(emailrequest);

          //Craft a request
          Map<String,Object> requestBody = Map.of(
                "contents",new Object[]{
                    Map.of("parts",new Object[]{
                        Map.of("text",prompt)
                    })
                }
          );
          //Do request and get response
          // Return response

          return null;
     }

     private String buildPrompt(EmailRequest emailRequest){
            StringBuilder prompt = new StringBuilder();
            prompt.append("Generate a professional email reply for the following email content and Please don't generate the subject line. And the email should be bold and quality wise good ");
            if(emailRequest.getTone()!=null && !emailRequest.getTone().isEmpty())
            {
                prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.\n");
            }
            prompt.append("Original Email : \n").append(emailRequest.getEmailContent());
            return prompt.toString();
     }
}
