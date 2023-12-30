package de.fcb.userdata.controller;

import static de.fcb.userdata.utils.AppConstants.ROOT_ORIGIN;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.fcb.userdata.domain.services.userData.UserDataService;
import de.fcb.userdata.domain.userData.models.UserData;
import lombok.RequiredArgsConstructor;

/**
 * Excel controller to handle the Excel file.
 */
@SuppressWarnings({ "FeatureEnvy", "LawOfDemeter", "MissingJavadoc" })
@RestController
@RequiredArgsConstructor
@CrossOrigin(ROOT_ORIGIN)
public class ExcelUploader {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExcelUploader.class);

    private final UserDataService userDataService;
    public static final String EXCEL_UPLOAD_RESOURCE_URL = "/upload/excelUpload";

    /**
     * Handles upload of the Excel file.
     *
     * @param file file to upload
     * @return the {@link ResponseEntity#ok} or {@link ResponseEntity#badRequest}
     */
    @PostMapping(EXCEL_UPLOAD_RESOURCE_URL)
    public ResponseEntity<String> uploadExcelFile(@RequestParam("file") final MultipartFile file) {
        LOGGER.info(file.getOriginalFilename());
        try (final Workbook workbook = WorkbookFactory.create(new ByteArrayInputStream(file.getBytes()))) {
            final Sheet sheet = workbook.getSheetAt(0);

            final Map<String, List<String>> userDataMap = new HashMap<>();
            final List<UserData> userDataToSave = new ArrayList<>();

            if(!validateExcel(sheet.getRow(0))) {
                return ResponseEntity.badRequest().build();
            }

            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                final Row row = sheet.getRow(rowIndex);

                final Cell emailCell = row.getCell(1);
                final String email = emailCell.toString();

                LOGGER.info("Check if email {} is blank", email);
                if(!email.isBlank()) {
                    final UserData userData = UserData.builder()
                            .id(null)
                            .email(email)
                            .username(checkCellForNull(row.getCell(0)))
                            .password(checkCellForNull(row.getCell(2)))
                            .active(true)
                            .visaormc(checkCellForNull(row.getCell(3)))
                            .cardnumber(checkCellForNull(row.getCell(4)))
                            .month(checkCellForNullAndDouble(row.getCell(5)))
                            .year(checkCellForNullAndDouble(row.getCell(6)))
                            .cvc(checkCellForNullAndDouble(row.getCell(7)))
                            .nameoncard(checkCellForNull(row.getCell(8)))
                            .kundennummer(checkCellForNullAndDouble(row.getCell(9)))
                            .mitgliedsnummer(checkCellForNullAndDouble(row.getCell(10)))
                            .geb(checkCellForNull(row.getCell(11)))
                            .street(checkCellForNull(row.getCell(12)))
                            .plz(checkCellForNullAndDouble(row.getCell(13)))
                            .city(checkCellForNull(row.getCell(14)))
                            .build();
                    userDataToSave.add(userData);
                }
                this.userDataService.saveAll(userDataToSave);
                LOGGER.info("Save all {} member data", userDataToSave.size());
            }

            final ObjectMapper objectMapper = new ObjectMapper();
            final String jsonResult = objectMapper.writeValueAsString(userDataMap);
            LOGGER.info("Response ok");
            return ResponseEntity.ok(jsonResult);
        } catch (final IOException e) {
            e.printStackTrace();
            LOGGER.error("Response bad request");
            return ResponseEntity.badRequest().build();
        }
    }

    private String checkCellForNull(final Cell cell) {
        return cell != null ? cell.toString() : "";
    }

    private String checkCellForNullAndDouble(final Cell cell) {
        if(cell != null && !cell.toString().isEmpty() && !cell.toString().equals("-")) {
            return String.format("%.0f", Double.parseDouble(cell.toString()));
        }
        return "";
    }

    private boolean validateExcel(final Row firstRow) {
        if (firstRow != null) {
            final String name = firstRow.getCell(0).getStringCellValue().trim().toLowerCase();
            final String account = firstRow.getCell(1).getStringCellValue().trim().toLowerCase();
            return name.equals("name") && account.equals("account");
        }
        return false;
    }
}
