package demo.web.websocket;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
public class NotifyService implements ApplicationListener<SessionDisconnectEvent>{
	private static final Logger log = LoggerFactory.getLogger(ActivityService.class);

    private final SimpMessageSendingOperations messagingTemplate;

    public NotifyService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @SubscribeMapping("/topic/notify")
    @SendTo("/topic/notify2")
    public Object sendActivity(@Payload Map<String, Object> data, StompHeaderAccessor stompHeaderAccessor, Principal principal) {
        data.put("sessionId", stompHeaderAccessor.getSessionId());
        data.put("isLogout", false);
        log.debug("Sending user tracking data {}", data.toString());
        return data;
    }

    @Override
    public void onApplicationEvent(SessionDisconnectEvent event) {
    	Map<String, Object> data = new HashMap<>();
    	data.put("sessionId", event.getSessionId());
    	data.put("total", 0);
    	data.put("isLogout", true);
        messagingTemplate.convertAndSend("/topic/notify2", data);
    }
}
