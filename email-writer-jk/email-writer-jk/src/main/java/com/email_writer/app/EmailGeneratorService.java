package com.email_writer.app;

import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApikey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

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
          String response = webClient.post()
                  .uri(geminiApiUrl + "?key="+geminiApikey)
                  .header("Content-Type","application/json")
                  .bodyValue(requestBody)
                  .retrieve()
                  .bodyToMono(String.class)
                  .block();
          // Return response

          return extractResponseContent(response);
     }

    private String extractResponseContent(String response) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        }
        catch(Exception e){
            return "Error processing request: "+e.getMessage();
        }
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
