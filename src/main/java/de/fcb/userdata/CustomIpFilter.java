package de.fcb.userdata;

import java.io.IOException;
import java.util.List;

import org.springframework.security.web.util.matcher.IpAddressMatcher;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@SuppressWarnings("MissingJavadoc")
@Component
public class CustomIpFilter implements Filter {
    private final MyIpService myIpService;

    public CustomIpFilter(final MyIpService myIpService) {
        this.myIpService = myIpService;
    }

    @Override
    public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain) throws IOException, ServletException {
        final HttpServletRequest httpRequest = (HttpServletRequest) request;
        final String currentIp = getClientIp(httpRequest);
        final List<String> allowedIps = this.myIpService.getAllowedIps();
        final boolean allowed = allowedIps.stream().anyMatch(ip -> new IpAddressMatcher(ip).matches(currentIp));

        if (!allowed) {
            final HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        chain.doFilter(request, response);
    }

    private String getClientIp(final HttpServletRequest request) {
        final String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader == null) {
            return request.getRemoteAddr();
        } else {
            return xForwardedForHeader.split(",")[0].trim();
        }
    }
}
