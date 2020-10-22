package com.devastation.improvinci;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@SpringBootApplication
@EnableWebSocket
public class ImprovinciApplication implements WebSocketConfigurer {
	public static void main(String[] args) {
		SpringApplication.run(ImprovinciApplication.class, args);
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(gameHandler(), "/improvinci").setAllowedOrigins("");
	}

	@Bean
	public WebsocketGameHandler gameHandler() {
		return new WebsocketGameHandler();
	}
	
	@Bean
	public ServletServerContainerFactoryBean createWebSocketContainer() {
		ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
		container.setMaxTextMessageBufferSize(24576);
		container.setMaxBinaryMessageBufferSize(24576);
		return container;
	}
}


