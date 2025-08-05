package ohka39.oudocumenthub.backend.services.impl;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.payload.DTO.AnalyticResponseDTO;
import ohka39.oudocumenthub.backend.repositories.CommentRepository;
import ohka39.oudocumenthub.backend.repositories.DocumentRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IAnalyticService;

@Service
@RequiredArgsConstructor
public class AnalyticServiceImpl implements IAnalyticService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Override
    public List<AnalyticResponseDTO> getAnalytics(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentPeriodStart;
        LocalDateTime previousPeriodStart;
        LocalDateTime previousPeriodEnd;

        switch (period.toUpperCase()) {
            case "DAY":
                // Current: Start of today to now
                currentPeriodStart = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
                // Previous: Start of yesterday to end of yesterday
                previousPeriodStart = currentPeriodStart.minusDays(1);
                previousPeriodEnd = currentPeriodStart.minusSeconds(1);
                break;
            case "WEEK":
                // Current: Start of this week (Monday) to now
                currentPeriodStart = now.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY))
                        .withHour(0).withMinute(0).withSecond(0).withNano(0);
                // Previous: Start of last week to end of last week
                previousPeriodStart = currentPeriodStart.minusWeeks(1);
                previousPeriodEnd = currentPeriodStart.minusSeconds(1);
                break;
            case "MONTH":
                // Current: Start of this month to now
                currentPeriodStart = now.with(TemporalAdjusters.firstDayOfMonth())
                        .withHour(0).withMinute(0).withSecond(0).withNano(0);
                // Previous: Start of last month to end of last month
                previousPeriodStart = currentPeriodStart.minusMonths(1);
                previousPeriodEnd = currentPeriodStart.minusSeconds(1);
                break;
            default:
                throw new IllegalArgumentException("Invalid period: " + period);
        }
        return Arrays.asList(
                AnalyticResponseDTO.createAnalyticResponseDTO("Total Users",
                        userRepository.countByCreatedAtBetween(currentPeriodStart, now),
                        "/Icon-3.svg", AnalyticResponseDTO.calculatePercentageChange(
                                userRepository.countByCreatedAtBetween(currentPeriodStart, now),
                                userRepository.countByCreatedAtBetween(previousPeriodStart, previousPeriodEnd))),
                AnalyticResponseDTO.createAnalyticResponseDTO("Documents Created",
                        documentRepository.countByCreatedAtBetween(currentPeriodStart, now),
                        "/Icon-2.svg", AnalyticResponseDTO.calculatePercentageChange(
                                documentRepository.countByCreatedAtBetween(currentPeriodStart, now),
                                documentRepository.countByCreatedAtBetween(previousPeriodStart, previousPeriodEnd))),
                AnalyticResponseDTO.createAnalyticResponseDTO("Orders", 0,
                        "/Icon-1.svg", 0.0),
                AnalyticResponseDTO.createAnalyticResponseDTO("Comments",
                        commentRepository.countByCreatedAtBetween(currentPeriodStart, now),
                        "/Icon.svg", AnalyticResponseDTO.calculatePercentageChange(
                                commentRepository.countByCreatedAtBetween(currentPeriodStart, now),
                                commentRepository.countByCreatedAtBetween(previousPeriodStart, currentPeriodStart))));

    }

}
