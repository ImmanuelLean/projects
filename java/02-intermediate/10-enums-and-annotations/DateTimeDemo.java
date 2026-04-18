import java.time.*;
import java.time.format.*;
import java.time.temporal.ChronoUnit;

/**
 * LESSON: Date and Time API (java.time - Java 8+)
 * The modern replacement for the old java.util.Date/Calendar classes.
 * All classes are IMMUTABLE and thread-safe.
 */
public class DateTimeDemo {
    public static void main(String[] args) {
        // ===== LOCAL DATE (date without time) =====
        System.out.println("--- LocalDate ---");
        LocalDate today = LocalDate.now();
        LocalDate birthday = LocalDate.of(2000, 5, 15);
        LocalDate parsed = LocalDate.parse("2024-12-25");

        System.out.println("Today: " + today);
        System.out.println("Birthday: " + birthday);
        System.out.println("Christmas: " + parsed);
        System.out.println("Year: " + today.getYear());
        System.out.println("Month: " + today.getMonth());
        System.out.println("Day: " + today.getDayOfMonth());
        System.out.println("Day of week: " + today.getDayOfWeek());
        System.out.println("Day of year: " + today.getDayOfYear());
        System.out.println("Is leap year? " + today.isLeapYear());

        // ===== LOCAL TIME (time without date) =====
        System.out.println("\n--- LocalTime ---");
        LocalTime now = LocalTime.now();
        LocalTime alarm = LocalTime.of(7, 30, 0);

        System.out.println("Now: " + now);
        System.out.println("Alarm: " + alarm);
        System.out.println("Hour: " + now.getHour());
        System.out.println("Minute: " + now.getMinute());

        // ===== LOCAL DATE TIME (date + time) =====
        System.out.println("\n--- LocalDateTime ---");
        LocalDateTime dateTime = LocalDateTime.now();
        LocalDateTime meeting = LocalDateTime.of(2024, 6, 15, 14, 30);

        System.out.println("Now: " + dateTime);
        System.out.println("Meeting: " + meeting);

        // ===== MODIFYING DATES (returns NEW instance) =====
        System.out.println("\n--- Modifying Dates ---");
        LocalDate tomorrow = today.plusDays(1);
        LocalDate nextWeek = today.plusWeeks(1);
        LocalDate nextMonth = today.plusMonths(1);
        LocalDate lastYear = today.minusYears(1);

        System.out.println("Tomorrow: " + tomorrow);
        System.out.println("Next week: " + nextWeek);
        System.out.println("Next month: " + nextMonth);
        System.out.println("Last year: " + lastYear);

        // ===== COMPARING DATES =====
        System.out.println("\n--- Comparing ---");
        System.out.println("Today is before Christmas? " + today.isBefore(parsed));
        System.out.println("Today is after birthday? " + today.isAfter(birthday));
        System.out.println("Same day? " + today.isEqual(LocalDate.now()));

        // ===== PERIOD (between dates) =====
        System.out.println("\n--- Period (date difference) ---");
        Period age = Period.between(birthday, today);
        System.out.printf("Age: %d years, %d months, %d days%n",
            age.getYears(), age.getMonths(), age.getDays());

        long daysBetween = ChronoUnit.DAYS.between(birthday, today);
        System.out.println("Days since birthday: " + daysBetween);

        // ===== DURATION (between times) =====
        System.out.println("\n--- Duration (time difference) ---");
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(17, 30);
        Duration workDay = Duration.between(start, end);
        System.out.println("Work hours: " + workDay.toHours() + "h " + workDay.toMinutesPart() + "m");

        // ===== FORMATTING =====
        System.out.println("\n--- Formatting ---");
        DateTimeFormatter formatter1 = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
        DateTimeFormatter formatter3 = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss");

        System.out.println("Format 1: " + today.format(formatter1));
        System.out.println("Format 2: " + today.format(formatter2));
        System.out.println("Format 3: " + dateTime.format(formatter3));

        // Parsing from formatted string
        LocalDate parsedFormatted = LocalDate.parse("25/12/2024", formatter1);
        System.out.println("Parsed: " + parsedFormatted);

        // ===== ZONED DATE TIME =====
        System.out.println("\n--- Time Zones ---");
        ZonedDateTime zonedNow = ZonedDateTime.now();
        ZonedDateTime tokyo = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));
        ZonedDateTime newYork = ZonedDateTime.now(ZoneId.of("America/New_York"));

        System.out.println("Local: " + zonedNow.format(DateTimeFormatter.ofPattern("HH:mm z")));
        System.out.println("Tokyo: " + tokyo.format(DateTimeFormatter.ofPattern("HH:mm z")));
        System.out.println("New York: " + newYork.format(DateTimeFormatter.ofPattern("HH:mm z")));

        // ===== INSTANT (machine timestamp) =====
        System.out.println("\n--- Instant ---");
        Instant timestamp = Instant.now();
        System.out.println("Epoch seconds: " + timestamp.getEpochSecond());
        System.out.println("Instant: " + timestamp);
    }
}
