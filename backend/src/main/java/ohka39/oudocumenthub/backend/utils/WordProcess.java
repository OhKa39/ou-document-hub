package ohka39.oudocumenthub.backend.utils;

import java.text.Normalizer;

public class WordProcess {
    public static String unstressVietnamese(String str) {
        str = str.toLowerCase();

        // Replace specific Vietnamese characters
        str = str.replaceAll("đ", "d");
        str = str.replaceAll("à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ", "a");
        str = str.replaceAll("è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ", "e");
        str = str.replaceAll("ì|í|ị|ỉ|ĩ", "i");
        str = str.replaceAll("ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ", "o");
        str = str.replaceAll("ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ", "u");
        str = str.replaceAll("ỳ|ý|ỵ|ỷ|ỹ", "y");

        // Normalize and remove combining diacritical marks
        str = Normalizer.normalize(str, Normalizer.Form.NFD);
        str = str.replaceAll("\\p{InCombiningDiacriticalMarks}+", ""); // Remove all combining diacritical marks

        return str;
    }
}
